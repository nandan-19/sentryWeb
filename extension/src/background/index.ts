// src/background/index.ts
import { checkPayloadWithOllama, chatWithOllama } from './api';
import { initNetworkMonitoring } from './network';

console.log("WebSec Background Service Worker initializing...");

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "ANALYZE_DOM") {
        checkPayloadWithOllama(message.content).then(result => {
            sendResponse(result);
        });
        return true;
    }

    if (message.type === "CHAT_WITH_COPILOT") {
        chatWithOllama(message.content, message.context).then(reply => {
            sendResponse({ reply });
        });
        return true;
    }
});

initNetworkMonitoring();
