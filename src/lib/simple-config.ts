import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Entry } from '@napi-rs/keyring';
import { ClockifyConfig } from '../types/clockify';

const CONFIG_DIR = path.join(os.homedir(), '.clockify-cli');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
// Fallback only — used when the OS keychain is unavailable (headless/CI, or
// Linux without a Secret Service). Written 0600. The keychain is preferred.
const API_KEY_FILE = path.join(CONFIG_DIR, 'api-key');

// OS keychain coordinates (macOS Keychain, Windows Credential Manager, libsecret).
const KEYRING_SERVICE = 'clockify-cli';
const KEYRING_ACCOUNT = 'api-key';

class SimpleConfigManager {
  private config: ClockifyConfig;

  constructor() {
    this.ensureConfigDir();
    this.config = this.loadConfig();
  }

  private ensureConfigDir(): void {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { mode: 0o700 }); // Secure permissions
    }
  }

  private loadConfig(): ClockifyConfig {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const data = fs.readFileSync(CONFIG_FILE, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      // Ignore errors, use defaults
    }

    return {
      timeFormat: '24h',
      billableByDefault: false,
      autoStartTimer: false,
      notificationsEnabled: true
    };
  }

  private saveConfig(): void {
    try {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2), { mode: 0o600 });
    } catch (error) {
      throw new Error(`Failed to save config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Store the API key in the OS keychain. Falls back to a 0600 file only if the
   * keychain is unavailable (headless/CI, or Linux without a Secret Service).
   */
  async setApiKey(apiKey: string): Promise<void> {
    try {
      new Entry(KEYRING_SERVICE, KEYRING_ACCOUNT).setPassword(apiKey);
      // Keychain succeeded — don't leave a stale plaintext fallback behind.
      if (fs.existsSync(API_KEY_FILE)) {
        try { fs.unlinkSync(API_KEY_FILE); } catch { /* ignore */ }
      }
    } catch {
      try {
        fs.writeFileSync(API_KEY_FILE, apiKey, { mode: 0o600 });
      } catch (error) {
        throw new Error(`Failed to store API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  /**
   * Retrieve the API key. Precedence: CLOCKIFY_API_KEY env var → OS keychain →
   * 0600 file fallback.
   */
  async getApiKey(): Promise<string | null> {
    if (process.env.CLOCKIFY_API_KEY) {
      return process.env.CLOCKIFY_API_KEY;
    }
    try {
      const fromKeychain = new Entry(KEYRING_SERVICE, KEYRING_ACCOUNT).getPassword();
      if (fromKeychain) {
        return fromKeychain;
      }
    } catch {
      // Keychain unavailable — fall through to the file.
    }
    try {
      if (fs.existsSync(API_KEY_FILE)) {
        return fs.readFileSync(API_KEY_FILE, 'utf8').trim();
      }
    } catch {
      /* ignore */
    }
    return null;
  }

  /**
   * Remove the API key from both the OS keychain and the file fallback.
   */
  async removeApiKey(): Promise<boolean> {
    let removed = false;
    try {
      if (new Entry(KEYRING_SERVICE, KEYRING_ACCOUNT).deletePassword()) {
        removed = true;
      }
    } catch {
      /* ignore */
    }
    try {
      if (fs.existsSync(API_KEY_FILE)) {
        fs.unlinkSync(API_KEY_FILE);
        removed = true;
      }
    } catch {
      /* ignore */
    }
    return removed;
  }

  /**
   * Check if API key exists
   */
  async hasApiKey(): Promise<boolean> {
    const apiKey = await this.getApiKey();
    return apiKey !== null && apiKey.length > 0;
  }

  /**
   * Get configuration value
   */
  get<K extends keyof ClockifyConfig>(key: K): ClockifyConfig[K] {
    return this.config[key];
  }

  /**
   * Set configuration value
   */
  set<K extends keyof ClockifyConfig>(key: K, value: ClockifyConfig[K]): void {
    this.config[key] = value;
    this.saveConfig();
  }

  /**
   * Get all configuration
   */
  getAll(): ClockifyConfig {
    return { ...this.config };
  }

  /**
   * Reset configuration to defaults
   */
  reset(): void {
    this.config = {
      timeFormat: '24h',
      billableByDefault: false,
      autoStartTimer: false,
      notificationsEnabled: true
    };
    this.saveConfig();
  }

  /**
   * Get configuration file path
   */
  getConfigPath(): string {
    return CONFIG_FILE;
  }
}

export const configManager = new SimpleConfigManager(); 