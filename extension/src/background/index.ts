// file: src/background/index.ts
import { checkPayloadWithOllama } from './api';
import { initNetworkMonitoring } from './network'; // Import the monitor

console.log("WebSec Background Service Worker initializing...");

// 1. Listen for DOM analysis requests from the Content Script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "ANALYZE_DOM") {
        checkPayloadWithOllama(message.content).then(result => {
            sendResponse(result);
        });
        return true;
    }
});

// 2. Start monitoring background POST requests
initNetworkMonitoring();
