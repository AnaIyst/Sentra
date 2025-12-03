# Installation Guide

## Quick Start

This extension supports **Firefox**, **Chrome**, and **Edge** browsers. Follow the instructions below for your preferred browser.

---

## 🔥 Firefox Installation

### Step 1: Prepare the Extension
1. Download or clone this repository
2. Ensure you have `manifest.json` in the root directory (this is the Firefox version)

### Step 2: Load the Extension
1. Open Firefox
2. Navigate to `about:debugging`
3. Click **"This Firefox"** in the left sidebar
4. Click **"Load Temporary Add-on"**
5. Select the `manifest.json` file from the extension directory
6. The extension is now installed!

> **Note**: Temporary add-ons are removed when Firefox restarts. For permanent installation, package as `.xpi`.

---

## 🌐 Chrome Installation

### Step 1: Prepare the Extension
1. Download or clone this repository
2. **Rename `manifest-v3.json` to `manifest.json`** (or backup the Firefox manifest first)
3. Ensure all files are in the same directory

### Step 2: Load the Extension
1. Open Chrome
2. Navigate to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle in the top right corner)
4. Click **"Load unpacked"**
5. Select the extension directory
6. The extension is now installed!

---

## 🪟 Edge Installation

### Step 1: Prepare the Extension
1. Download or clone this repository
2. **Rename `manifest-v3.json` to `manifest.json`** (or backup the Firefox manifest first)
3. Ensure all files are in the same directory

### Step 2: Load the Extension
1. Open Microsoft Edge
2. Navigate to `edge://extensions/`
3. Enable **"Developer mode"** (toggle in the bottom left corner)
4. Click **"Load unpacked"**
5. Select the extension directory
6. The extension is now installed!

---

## ⚙️ Configuration

Before using the extension, make sure to configure your API keys:

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

---

## 🔄 Switching Between Browsers

If you want to use the extension in multiple browsers:

1. **For Firefox**: Use `manifest.json` (Manifest V2)
2. **For Chrome/Edge**: Use `manifest-v3.json` (rename to `manifest.json`)

You can maintain both manifests in your repository and rename as needed, or create separate build directories for each browser.

---

## ✅ Verification

After installation, verify the extension is working:

1. Click the extension icon in your browser toolbar
2. You should see the "Sentra Scanner" interface
3. Try searching for a test IP (e.g., `8.8.8.8`) or domain (e.g., `google.com`)
4. Results should display correctly

---

## 🐛 Troubleshooting

### Extension Not Loading
- Ensure all files are in the same directory
- Check that `manifest.json` is valid JSON
- Verify `config.js` exists and contains valid API keys

### API Errors
- Verify your API keys are correct in `config.js`
- Check that you have internet connectivity
- Ensure the API endpoints are accessible

### Permission Errors
- Make sure the manifest includes the correct permissions
- For Chrome/Edge, ensure `host_permissions` are set in Manifest V3

---

## 📦 Packaging for Distribution

### Firefox (.xpi)
1. Zip all extension files
2. Rename to `.xpi`
3. Submit to Firefox Add-ons store

### Chrome (.crx)
1. Use Chrome's "Pack extension" feature
2. Or submit directly to Chrome Web Store

### Edge
1. Package similar to Chrome
2. Submit to Microsoft Edge Add-ons store

