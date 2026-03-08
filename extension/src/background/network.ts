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

async function blockHost(url: string) {
    const host = new URL(url).hostname;
    const ruleId = Math.floor(Math.random() * 1000) + 1; // Unique ID for the rule

    console.warn(`[WebSec] HARD BLOCK: Adding rule to block all traffic to ${host}`);

    await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [{
            id: ruleId,
            priority: 1,
            action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
            condition: { urlFilter: host, resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME, chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST] }
        }],
        removeRuleIds: [ruleId] // Clean up existing rule with same ID if it exists
    });
}

async function analyzePayload(tabId: number, url: string, payload: string) {
    const result = await checkPayloadWithOllama(payload);

    if (result.isMalicious) {
        // 1. Trigger the Hard Block
        await blockHost(url);

        // 2. Alert the UI
        chrome.tabs.sendMessage(tabId, {
            type: "SECURITY_ALERT",
            payload: `CRITICAL: Request to ${new URL(url).hostname} was BLOCKED. Reason: ${result.reason}`
        });
    }
}
