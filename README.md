# Clockify CLI ⏰

[![npm version](https://badge.fury.io/js/clockify-cli.svg)](https://badge.fury.io/js/clockify-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/yourusername/clockify-cli/workflows/Node.js%20CI/badge.svg)](https://github.com/yourusername/clockify-cli/actions)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=clockify-cli&metric=security_rating)](https://sonarcloud.io/dashboard?id=clockify-cli)

A powerful, secure, and user-friendly command-line interface for time tracking with [Clockify](https://clockify.me). Track your time, manage projects, and generate reports—all from your terminal.

## 🚀 Features

- **⚡ Fast & Lightweight**: Start tracking in milliseconds
- **🔒 Secure**: API key stored in your OS keychain (macOS Keychain · Windows Credential Manager · Linux Secret Service), with a `CLOCKIFY_API_KEY` env override and a `0600`-file fallback when no keychain is available
- **📊 Rich Reports**: Daily, weekly, monthly summaries with export options
- **🎯 Project Management**: Create and manage projects, tasks, and clients
- **🌐 Cross-Platform**: Works on macOS, Linux, and Windows
- **📱 Offline Support**: Cache data for offline viewing
- **🎨 Beautiful Output**: Colorized, formatted tables and status indicators

## 📦 Installation

### npm (Recommended)
```bash
npm install -g clockify-cli
```

### Homebrew (macOS)
```bash
brew install clockify-cli
```

### Download Binary
Download pre-built binaries from [GitHub Releases](https://github.com/yourusername/clockify-cli/releases).

## 🔧 Quick Start

1. **Get your API key** from [Clockify Settings](https://clockify.me/user/settings)

2. **Login and configure**:
   ```bash
   clockify auth login
   ```

3. **Start tracking time**:
   ```bash
   clockify start -p "My Project" -d "Working on awesome features"
   ```

4. **Check your status**:
   ```bash
   clockify status
   ```

5. **Stop tracking**:
   ```bash
   clockify stop
   ```

## 📖 Usage

### Authentication
```bash
# Configure API key
clockify auth login --key YOUR_API_KEY

# Check authentication status
clockify auth status

# Remove credentials
clockify auth logout
```

### Time Tracking
```bash
# Start timer
clockify start --project "Web Development" --task "Frontend" --description "Building UI components"

# Quick start (with aliases)
clockify start -p "Web Dev" -t "Frontend" -d "Building UI"

# Stop current timer
clockify stop

# Pause/resume timer
clockify pause
clockify resume

# Check current status
clockify status
```

### Manual Time Entries
```bash
# Add time entry with duration
clockify add 2h30m -p "Project" -d "Past work"

# Add with specific start/end times
clockify add 1h --start-time "09:00" --end-time "10:00"

# Edit existing entry
clockify edit ENTRY_ID --description "Updated description"

# Delete entry
clockify delete ENTRY_ID
```

### Projects & Tasks
```bash
# List projects
clockify projects list

# Create new project
clockify projects create "New Project" --client "Client Name"

# List tasks for project
clockify tasks list "Project Name"

# Create task
clockify tasks create "New Task" --project "Project Name"
```

### Reports & Analytics
```bash
# Today's summary
clockify report today

# This week's summary
clockify report week

# Custom date range
clockify report custom --start 2023-10-01 --end 2023-10-31

# Export data
clockify export csv --start 2023-10-01 --output timesheet.csv
```

### Configuration
```bash
# Show current config
clockify config show

# Set default project
clockify config set defaultProject "My Main Project"

# Switch workspace
clockify workspace switch "Other Workspace"
```

## 🔒 Security

This project takes security seriously:

- **🔐 Secure Credential Storage**: API key stored in your OS keychain via `@napi-rs/keyring` (macOS Keychain · Windows Credential Manager · Linux Secret Service); `CLOCKIFY_API_KEY` env override and a `0600`-file fallback are also supported
- **🛡️ Input Validation**: All inputs sanitized and validated
- **📡 HTTPS Only**: All API communications over encrypted connections
- **🔍 Dependency Scanning**: Regular security audits with Snyk and npm audit
- **🚫 No Secrets in Code**: Zero hardcoded credentials or sensitive data

### Security Best Practices

1. **Never share your API key** in code or commit it to version control
2. **Use environment variables** for CI/CD: `CLOCKIFY_API_KEY=your_key`
3. **Regularly rotate** your API keys in Clockify settings
4. **Report security issues** via our [security policy](SECURITY.md)

## 📊 Examples

### Daily Workflow
```bash
# Morning: Start work
clockify start -p "Client Project" -d "Daily standup and planning"

# Switch tasks
clockify stop
clockify start -p "Client Project" -t "Development" -d "Implementing user authentication"

# Lunch break (automatic pause)
clockify pause

# Resume after lunch
clockify resume

# End of day
clockify stop
clockify report today
```

### Weekly Review
```bash
# Generate weekly report
clockify report week --format table

# Export for timesheet
clockify export csv --start $(date -d 'last monday' +%Y-%m-%d) --output weekly-timesheet.csv

# Project breakdown
clockify report custom --start $(date -d 'last monday' +%Y-%m-%d) --project "Main Project"
```

## 🛠️ Development

### Prerequisites
- Node.js 16+
- npm 7+

### Setup
```bash
# Clone repository
git clone https://github.com/yourusername/clockify-cli.git
cd clockify-cli

# Install dependencies
npm install

# Build project
npm run build

# Run in development
npm run dev -- auth status
```

### Testing
```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Security audit
npm run security
```

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run security checks: `npm run security`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- **Documentation**: [Full documentation](https://github.com/yourusername/clockify-cli/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/clockify-cli/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/clockify-cli/discussions)
- **Security**: [Security Policy](SECURITY.md)

## 🙏 Acknowledgments

- [Clockify](https://clockify.me) for providing an excellent time tracking API
- [Commander.js](https://github.com/tj/commander.js/) for CLI framework
- All contributors and users who make this project better

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/clockify-cli&type=Date)](https://star-history.com/#yourusername/clockify-cli&Date)

---

Made with ❤️ for developers who value their time 