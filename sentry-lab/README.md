# Sentry Lab - External Website Attack with Network Packet Capture

This project demonstrates a security lab setup showing how a victim page can automatically trigger attacks that redirect to **real external websites** like Amazon, Flipkart, Instagram, etc., while capturing network packets **without any user interaction**.

## 🌐 Attack Mode: External Website Redirects

**CRITICAL**: This version uses **automatic external website redirects** - the attack starts **IMMEDIATELY** when the legitimate website loads and opens real external websites in stealth mode!

## 🎯 External Websites Targeted

The attack randomly selects 6 websites from this list:
- **E-commerce**: Amazon, Flipkart, eBay, Walmart, Target, Etsy, AliExpress, BestBuy
- **Social Media**: Instagram, Facebook, Twitter, LinkedIn, YouTube, Reddit
- **Custom**: https://runvay.co.in

## Project Structure

```
sentry-lab/
├── attacker-page/          # Malicious attacker server
│   ├── attacker.js         # Attack server (port 5001)
│   └── package.json
├── logger-server/          # Data collection server
│   ├── server.js           # Logger with external redirect capture (port 6000)
│   └── package.json
└── victim-page/           # Victim frontend application
    ├── backend/           # Victim backend (port 5000)
    │   ├── victim.js
    │   └── package.json
    └── frontend/          # React frontend (port 5173)
        ├── src/
        │   └── App.jsx    # Contains external website attack code
        ├── public/
        └── package.json
```

## Setup Instructions

### 1. Install Dependencies

Navigate to each directory and install dependencies:

```bash
# Attacker server
cd attacker-page
npm install

# Logger server  
cd ../logger-server
npm install

# Victim backend
cd ../victim-page/backend
npm install

# Victim frontend
cd ../frontend
npm install
```

### 2. Start All Servers

Open 4 separate terminal windows and run:

```bash
# Terminal 1: Victim Backend
cd victim-page/backend
node victim.js

# Terminal 2: Victim Frontend
cd victim-page/frontend
npm run dev

# Terminal 3: Attacker Server
cd attacker-page
node attacker.js

# Terminal 4: Logger Server
cd logger-server
node server.js
```

### 3. Test External Website Attack

1. Open your browser and navigate to `http://localhost:5173`
2. **THE ATTACK STARTS AUTOMATICALLY!**
3. Watch the attack progress in real-time:
   - Automatic data collection on page load
   - **6 random external websites opened** in stealth mode
   - Network packet capture for all requests
   - Real-time status updates showing which sites are being opened

## 🚀 How External Website Attack Works

### Immediate External Redirects
**As soon as the page loads:**
1. **Automatic initialization** - Attack starts without any user action
2. **Data collection** - User data immediately sent to logger
3. **Random website selection** - 6 websites randomly chosen from the list
4. **Stealth window opening** - External sites opened in invisible 1x1 windows
5. **Packet capture** - All network traffic captured and logged
6. **Automatic cleanup** - Windows closed after 3 seconds

### Attack Sequence
```
PAGE LOADS
    ↓
AUTOMATIC ATTACK INITIATED
    ↓
DATA COLLECTED & SENT TO LOGGER
    ↓
RANDOM SELECTION: 6 WEBSITES FROM 15 AVAILABLE
    ↓
EXTERNAL REDIRECT 1: amazon.com (stealth window)
    ↓
EXTERNAL REDIRECT 2: flipkart.com (stealth window)
    ↓
EXTERNAL REDIRECT 3: instagram.com (stealth window)
    ↓
EXTERNAL REDIRECT 4: youtube.com (stealth window)
    ↓
EXTERNAL REDIRECT 5: ebay.com (stealth window)
    ↓
EXTERNAL REDIRECT 6: runvay.co.in (stealth window)
    ↓
ATTACK COMPLETE
```

### External Website Redirects
Each redirect:
- **Opens real external website** in stealth mode (1x1 pixel, off-screen)
- **Captures network packet** with full details
- **Logs to external_redirects.log** file
- **Waits 3 seconds** for site to load
- **Closes stealth window** automatically
- **Waits 2 seconds** before next redirect

### Network Packet Capture
Every single request is captured:
- **Page load packets**
- **Automatic attack initialization packets**
- **External redirect packets** (6 total)
- **External website traffic** (headers, cookies, etc.)

### Victim Page (`localhost:5173`) - External Mode
- **No user interaction required** - Attack starts immediately
- **Real-time status display** showing which external sites are being opened
- **Live packet capture display** on screen
- **Random website selection** for variety
- **External redirect counter** and completion status

### Logger Server (`localhost:6000`) - External Redirect Analysis
- **External redirect logging** and storage
- **Network packet capture** and storage
- **Traffic analysis** and statistics
- **File logging** for forensic analysis
- **Multi-file logging**: stolen_data.log, captured_packets.log, external_redirects.log

## 📡 External Redirect Capture Details

### Captured Information
Each external redirect capture includes:
- **External website URL** (real domain)
- **Domain name** extracted from URL
- **Redirect sequence number** (1-6)
- **Timestamp** (precise timing)
- **User data** (cookies, user agent, screen, language)
- **Stealth window details**

### External Websites Available
```javascript
const attackWebsites = [
  "https://www.amazon.com",      // E-commerce
  "https://www.flipkart.com",    // E-commerce
  "https://www.ebay.com",        // E-commerce
  "https://www.walmart.com",     // E-commerce
  "https://www.target.com",      // E-commerce
  "https://www.etsy.com",        // E-commerce
  "https://www.aliexpress.com",  // E-commerce
  "https://www.bestbuy.com",     // E-commerce
  "https://www.runvay.co.in",    // Custom site
  "https://www.instagram.com",   // Social media
  "https://www.facebook.com",    // Social media
  "https://www.twitter.com",     // Social media
  "https://www.linkedin.com",    // Social media
  "https://www.youtube.com",     // Social media
  "https://www.reddit.com"       // Social media
];
```

## 📊 Monitoring the External Attack

### Real-time Attack Monitoring
```bash
# View attack status and statistics
curl http://localhost:5001/stats

# View captured packets
curl http://localhost:5001/packets

# View collected data
curl http://localhost:5001/data

# Check server health
curl http://localhost:5001/health
```

### Logger Server External Redirect Analysis
```bash
# View all captured packets
curl http://localhost:6000/packets

# Network traffic analysis
curl http://localhost:6000/analysis

# View all collected data
curl http://localhost:6000/data
```

### File-based External Redirect Analysis
```bash
# View raw packet capture log
cat logger-server/captured_packets.log

# View stolen data log
cat logger-server/stolen_data.log

# View external redirects log
cat logger-server/external_redirects.log
```

## 🎯 External Attack Impact Analysis

### Automatic External Attack Statistics
- **0 clicks required** - Attack is fully automatic
- **6 external websites** opened randomly from 15 available
- **Real domains** - Amazon, Flipkart, Instagram, YouTube, etc.
- **Stealth windows** - 1x1 pixels, off-screen, auto-closed
- **Complete data exfiltration** in ~15 seconds
- **Network surveillance** of external site traffic

### Data Collected Automatically
- **Browser cookies** (session tokens, authentication)
- **User agent string** (browser fingerprinting)
- **Screen resolution** (device identification)
- **Browser language** (localization data)
- **External website traffic** patterns
- **Redirect sequence timing**
- **Domain access patterns**

## 🚨 Real-World Danger

This external website attack is particularly dangerous because:
- **No user interaction needed** - Attack starts on page load
- **Real external websites** - Legitimate domains raise no suspicion
- **Random selection** - Different sites each time
- **Stealth execution** - Invisible windows minimize detection
- **Network surveillance** - Captures external site traffic
- **Forensic evidence** - All external redirects logged

## 🕵️ External Attack Forensics

### Attack Timeline
1. **T+0s**: Page loads, automatic attack initiated
2. **T+0.5s**: Initial data sent to logger
3. **T+1s**: Random selection of 6 external websites
4. **T+1.5s**: External redirect 1 (e.g., amazon.com)
5. **T+3.5s**: External redirect 2 (e.g., flipkart.com)
6. **T+5.5s**: External redirect 3 (e.g., instagram.com)
7. **T+7.5s**: External redirect 4 (e.g., youtube.com)
8. **T+9.5s**: External redirect 5 (e.g., ebay.com)
9. **T+11.5s**: External redirect 6 (e.g., runvay.co.in)
10. **T+15s**: Attack complete, all external sites accessed

### Evidence Collected
- **Complete network traffic log**
- **External redirect sequence** with timestamps
- **All stolen user data**
- **External website access patterns**
- **Server-side logs** from logger
- **File-based evidence** for forensic analysis

## Port Summary

- **5173**: Victim Frontend (React/Vite) - External attack trigger
- **5000**: Victim Backend (Express) - API server
- **5001**: Attacker Server (Express) - Attack coordination
- **6000**: Logger Server (Express) - External redirect capture

## ⚠️ Educational Warning

This demonstrates **highly dangerous external website attack techniques**:
- **Zero-interaction attacks** that trigger on page load
- **Real external website redirects** for legitimate appearance
- **Network packet capture** for complete surveillance
- **Random website selection** for attack variety
- **Stealth techniques** to avoid detection

**For educational purposes only.** Do not use for illegal activities.
