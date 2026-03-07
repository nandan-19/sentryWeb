// src/content/index.ts
import { injectAgentUI } from './injectUI';
console.log("WebSec Agent: Content Script Active.");

// Use a Set to track what we've already analyzed to avoid spamming Ollama
const processedHashes = new Set<string>();

const sanitizeDOM = (textContext: string) => {
    // Find elements containing the malicious text
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
        if (node.textContent?.includes(textContext)) {
            const parent = node.parentElement;
            if (parent && parent.tagName !== "SCRIPT") {
                console.warn("[WebSec] Sanitizing suspicious node...");
                parent.style.filter = "blur(5px)"; // Visual feedback
                parent.style.pointerEvents = "none";
                // Optionally: parent.remove();
            }
        }
    }
};

async function analyzeSecurity(text: string) {
    // Simple hash or length check to prevent redundant calls
    const contentHash = text.slice(0, 100);
    if (processedHashes.has(contentHash)) return;
    processedHashes.add(contentHash);

    try {
        const response = await chrome.runtime.sendMessage({
            type: "ANALYZE_DOM",
            content: text.slice(0, 3000) // 1.5b models have context limits; 3k is plenty
        });

        if (response?.isMalicious) {
            console.error("WebSec Alert:", response.reason);
            sanitizeDOM(text);
            // We will later replace this with a React Toast notification
            showSecurityBadge(response.reason);
        }
    } catch (err) {
        console.error("Communication error with Background Worker", err);
    }
}

/**
 * Heuristics to decide if text is worth an SLM call
 */
function shouldAnalyze(text: string): boolean {
    const triggers = ["ignore all previous", "system prompt", "dan mode", "<script>", "eval("];
    const lowerText = text.toLowerCase();
    return triggers.some(t => lowerText.includes(t)) || text.length > 500;
}

/**
 * Mutation Observer with Debouncing
 */
let scanTimeout: number;
const observer = new MutationObserver(() => {
    clearTimeout(scanTimeout);
    scanTimeout = window.setTimeout(() => {
        const bodyText = document.body.innerText;
        if (shouldAnalyze(bodyText)) {
            analyzeSecurity(bodyText);
        }
    }, 1000); // Wait 1 second after last DOM change to scan
});

// Start watching
observer.observe(document.body, { childList: true, subtree: true });

// Initial scan
window.addEventListener("load", () => {
    analyzeSecurity(document.body.innerText);
});

// Temporary Badge UI until React is ready
function showSecurityBadge(reason: string) {
    const badge = document.createElement('div');
    badge.style.cssText = "fixed; bottom: 20px; right: 20px; background: red; color: white; padding: 10px; z-index: 9999; border-radius: 8px; font-family: sans-serif;";
    badge.innerText = `⚠️ Threat Detected: ${reason}`;
    document.body.appendChild(badge);
}

window.addEventListener('load', () => {
    injectAgentUI();
});
