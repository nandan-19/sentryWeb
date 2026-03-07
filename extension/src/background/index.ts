import { checkPayloadWithOllama } from './api';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "ANALYZE_DOM") {
        checkPayloadWithOllama(message.content).then(result => {
            sendResponse(result);
        });
        return true; // Keeps the message channel open for async response
    }
});
