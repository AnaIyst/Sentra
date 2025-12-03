<img src="sentra.png" width="500" height="300" align="center">

<div align="center">

![Firefox Extension](https://img.shields.io/badge/Firefox-Extension-FF7139?style=for-the-badge&logo=firefox-browser&logoColor=white)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)
![Edge Extension](https://img.shields.io/badge/Edge-Extension-0078D4?style=for-the-badge&logo=microsoft-edge&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**A powerful cross-browser extension for comprehensive security scanning of IP addresses, domains, and file hashes**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Configuration](#-configuration)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [API Integration](#-api-integration)
- [License](#-license)

---

## 🎯 Overview

**Sentra Scanner** is a modern cross-browser extension (Firefox, Chrome, Edge) that provides comprehensive security analysis for IP addresses, domains, and file hashes. Built with a sleek dark theme interface, it integrates multiple security APIs to deliver detailed threat intelligence and network information.

### Key Capabilities

- 🔍 **Multi-Source Scanning**: Combines Sentra (VirusTotal) and VPN API data
- 🌐 **IP Address Analysis**: Security status, geolocation, and network information
- 🌍 **Domain Intelligence**: DNS records, WHOIS data, and contact information
- 🔐 **Hash Verification**: File hash analysis with comprehensive engine results
- 🎨 **Modern UI**: Clean, dark-themed interface inspired by modern design principles

---

## ✨ Features

### IP Address Scanning
- ✅ **Security Analysis**: VPN, Proxy, Tor, and Relay detection
- ✅ **Geolocation Data**: City, region, country, coordinates, and timezone
- ✅ **Network Information**: ASN, network CIDR, and autonomous system organization
- ✅ **Threat Intelligence**: Comprehensive scan results from multiple security engines

### Domain Scanning
- ✅ **DNS Records**: Complete DNS record analysis (A, AAAA, MX, NS, CNAME, TXT, SOA)
- ✅ **WHOIS Information**: Detailed domain registration and ownership data
- ✅ **Contact Information**: Registrant, administrative, and technical contact details
- ✅ **Threat Analysis**: Multi-engine security scanning results

### Hash Scanning
- ✅ **File Analysis**: MD5, SHA1, and SHA256 hash verification
- ✅ **Engine Results**: Detailed results from all security scanning engines
- ✅ **Threat Classification**: Harmless, malicious, suspicious, and undetected categorization

### User Interface
- ✅ **Dark Theme**: Modern dark grey/black color scheme
- ✅ **Responsive Design**: Clean and intuitive user experience
- ✅ **Real-time Results**: Instant display of scan results
- ✅ **Organized Layout**: Tab-based interface for easy navigation

---

## 🚀 Installation

### Firefox Installation

1. Open Firefox and navigate to `about:debugging`
2. Click **"This Firefox"** in the left sidebar
3. Click **"Load Temporary Add-on"**
4. Select the `manifest.json` file from this repository
5. The extension will be installed and ready to use!

> **Note**: For permanent installation, package the extension as an `.xpi` file.

### Chrome Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top right)
3. Click **"Load unpacked"**
4. Select the extension directory
5. **Important**: Rename `manifest-v3.json` to `manifest.json` before loading, or use the Chrome-specific manifest

> **Note**: Chrome requires Manifest V3. Use `manifest-v3.json` as your `manifest.json` for Chrome.

### Edge Installation

1. Open Edge and navigate to `edge://extensions/`
2. Enable **"Developer mode"** (toggle in bottom left)
3. Click **"Load unpacked"**
4. Select the extension directory
5. **Important**: Rename `manifest-v3.json` to `manifest.json` before loading, or use the Edge-specific manifest

> **Note**: Edge requires Manifest V3. Use `manifest-v3.json` as your `manifest.json` for Edge.

---

## 📖 Usage

### Getting Started

1. **Click the extension icon** in your browser toolbar
2. **Select a scan type**:
   - **IP Address**: For IP security and location analysis
   - **Domain**: For domain and DNS information
   - **Hash**: For file hash verification

3. **Enter your query** in the search box
4. **Click "Search"** or press Enter
5. **View comprehensive results** including:
   - Security statistics
   - Detailed engine results
   - Additional intelligence data

### IP Address Search Example

```
Input: 8.8.8.8
Results:
- Security: VPN, Proxy, Tor, Relay status
- Location: City, Country, Coordinates, Timezone
- Network: ASN, Network CIDR, Organization
- Threat Analysis: Scan results from security engines
```

### Domain Search Example

```
Input: google.com
Results:
- DNS Records: A, AAAA, MX, NS records
- WHOIS: Registration details, dates, nameservers
- Contact Info: Registrant, admin, technical contacts
- Threat Analysis: Security scan results
```

### Hash Search Example

```
Input: [MD5/SHA1/SHA256 hash]
Results:
- Engine Results: Detailed scan results
- Threat Classification: Harmless/Malicious/Suspicious
- Analysis Statistics: Comprehensive breakdown
```

---

## ⚙️ Configuration

### API Keys Setup

1. Open `config.js` in the extension directory
2. Add your API keys:

```javascript
const CONFIG = {
  SENTRA_API_KEY: 'your-sentra-api-key-here',
  SENTRA_API_BASE: 'https://www.virustotal.com/api/v3',
  VPN_API_KEY: 'your-vpn-api-key-here',
  VPN_API_BASE: 'https://vpnapi.io/api'
};
```

### Required API Keys

- **Sentra API Key**: Get your API key from [VirusTotal](https://www.virustotal.com/gui/join-us)
- **VPN API Key**: Get your API key from [VPNAPI.io](https://vpnapi.io/)

---

## 🔌 API Integration

### Sentra (VirusTotal) API

- **Endpoint**: `https://www.virustotal.com/api/v3`
- **Endpoints Used**:
  - `/ip_addresses/{ip}` - IP address analysis
  - `/domains/{domain}` - Domain analysis
  - `/files/{hash}` - File hash analysis

### VPN API (VPNAPI.io)

- **Endpoint**: `https://vpnapi.io/api`
- **Features**:
  - Security detection (VPN, Proxy, Tor, Relay)
  - Geolocation data
  - Network information (ASN, organization)

---

## 🛠️ Development

### Project Structure

```
Sentra/
├── manifest.json          # Firefox manifest (V2)
├── manifest-v3.json      # Chrome/Edge manifest (V3)
├── popup.html            # Main popup interface
├── popup.js              # Extension logic
├── popup.css             # Styling
├── config.js             # API configuration
└── README.md             # This file
```

### Building

No build process required. The extension uses vanilla JavaScript and can be loaded directly into any supported browser.

**For Chrome/Edge**: Use `manifest-v3.json` (rename to `manifest.json` or update your build process)

**For Firefox**: Use `manifest.json` (Manifest V2)

### Testing

1. **Firefox**: Load the extension using `about:debugging`
2. **Chrome**: Load unpacked extension from `chrome://extensions/`
3. **Edge**: Load unpacked extension from `edge://extensions/`
4. Test each scan type (IP, Domain, Hash)
5. Verify API responses and data display
6. Check error handling for invalid inputs

### Browser Compatibility

| Browser | Manifest Version | Status |
|---------|-----------------|--------|
| Firefox | V2 | ✅ Supported |
| Chrome | V3 | ✅ Supported |
| Edge | V3 | ✅ Supported |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for the security community**

⭐ Star this repo if you find it useful!

</div>








