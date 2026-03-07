// src/background/network.ts
import { checkPayloadWithOllama } from './api';

export const initNetworkMonitoring = () => {
    chrome.webRequest.onBeforeRequest.addListener(
        (details): chrome.webRequest.BlockingResponse | undefined => { // Use 'undefined', not 'void'
            if (details.method === "POST" && details.requestBody) {
                const url = details.url;
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

                if (payload) {
                    analyzePayload(url, payload);
                }
            }

            // Explicitly return undefined to satisfy the strict type requirement
            return undefined;
        },
        { urls: ["<all_urls>"] },
        ["requestBody"]
    );
};

async function analyzePayload(url: string, payload: string) {
    const result = await checkPayloadWithOllama(payload);
    if (result.isMalicious) {
        console.error(`🚨 THREAT: ${result.reason}`);
    }
}
