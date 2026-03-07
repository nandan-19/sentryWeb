// file: src/background/network.ts
import { checkPayloadWithOllama } from './api';

export const initNetworkMonitoring = () => {
    chrome.webRequest.onBeforeRequest.addListener(
        (details): chrome.webRequest.BlockingResponse | undefined => {

            if (details.url.includes("localhost:11434")) {
                return undefined;
            }

            if (details.method === "POST" && details.requestBody) {
                const url = details.url;
                const tabId = details.tabId; // Get the ID of the tab making the request
                const body = details.requestBody;

                console.log(`[Network Monitor] Intercepted POST to: ${url}`);

                let payload = "";
                if (body.formData) {
                    payload = JSON.stringify(body.formData);
                } else if (body.raw) {
                    const decoder = new TextDecoder("utf-8");
                    payload = body.raw
                        .map(r => r.bytes ? decoder.decode(r.bytes) : "")
                        .join("")
                        .slice(0, 5000);
                }

                // Only analyze if the request originated from a real tab (tabId > -1)
                if (payload && tabId > -1) {
                    analyzePayload(tabId, url, payload);
                }
            }

            return undefined;
        },
        { urls: ["<all_urls>"] },
        ["requestBody"]
    );
};

async function analyzePayload(tabId: number, url: string, payload: string) {
    console.log(`[Ollama] Analyzing payload to ${url}...`);

    const result = await checkPayloadWithOllama(payload);

    // Log the actual verdict so we can see it in the Service Worker console
    console.log(`[Ollama Verdict] Malicious: ${result.isMalicious}, Reason: ${result.reason}`);

    if (result.isMalicious) {
        try {
            chrome.tabs.sendMessage(tabId, {
                type: "SECURITY_ALERT",
                payload: `Intercepted malicious POST request to ${new URL(url).hostname}: ${result.reason}`
            });
        } catch (err) {
            console.error("Failed to send alert to UI", err);
        }
    }
}
