// src/content/index.ts
import { injectAgentUI } from './injectUI';
import { initSandboxWebSocket } from '../background/api';

console.log("WebSec Agent: Aggressive DOM Scanner Active.");

const processedHashes = new Set<string>();

const sanitizeDOM = (maliciousText: string, reason: string) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    let mitigated = false;

    // Use a substring to easily match the text even if formatting changes
    const matchTarget = maliciousText.trim().substring(0, 30);

    while ((node = walker.nextNode())) {
        if (node.textContent && node.textContent.includes(matchTarget)) {
            const parent = node.parentElement;

            // Protect our own UI from being blurred
            if (parent && !parent.closest('#websec-agent-container') && parent.tagName !== "SCRIPT") {
                console.warn(`[WebSec] MITIGATION ENGAGED: Removing threat...`);

                // Aggressive Mitigation (Blur, disable clicks, red border)
                parent.style.filter = "blur(10px) grayscale(100%)";
                parent.style.pointerEvents = "none";
                parent.style.userSelect = "none";
                parent.style.border = "3px dashed red";
                parent.setAttribute('title', `Blocked by WebSec: ${reason}`);

                mitigated = true;
            }
        }
    }

    if (mitigated) {
        // Send alert to our React UI in the same tab
        window.dispatchEvent(new CustomEvent('WEBSEC_DOM_ALERT', {
            detail: `I just neutralized an element containing:\n\n> "${matchTarget}..."\n\n**Reason:** ${reason}`
        }));
    }
};

async function analyzeSecurity(text: string) {
    const contentHash = text.slice(0, 100);
    if (processedHashes.has(contentHash)) return;
    processedHashes.add(contentHash);

    try {
        const response = await chrome.runtime.sendMessage({
            type: "ANALYZE_DOM",
            content: text.slice(0, 3000)
        });

        if (response?.isMalicious) {
            sanitizeDOM(text, response.reason);
        }
    } catch (err) {
        console.error("Communication error", err);
    }
}

function shouldAnalyze(text: string): boolean {
    const triggers = ["ignore", "previous", "system prompt", "override", "dan mode"];
    const lowerText = text.toLowerCase();
    // Analyze if it contains trigger words AND is reasonably long
    return triggers.some(t => lowerText.includes(t)) && text.length > 20;
}

// -----------------------------------------------------
// HYPER-AGGRESSIVE MUTATION OBSERVER
// -----------------------------------------------------
let scanTimeout: number;
const observer = new MutationObserver((mutations) => {
    clearTimeout(scanTimeout);
    scanTimeout = window.setTimeout(() => {
        let textToScan = "";

        mutations.forEach(m => {
            // Catch text being typed or edited in DevTools
            if (m.type === 'characterData' && m.target.textContent) {
                textToScan += m.target.textContent + " ";
            }
            // Catch new HTML elements being added
            else if (m.type === 'childList') {
                m.addedNodes.forEach(node => {
                    if (node.textContent) textToScan += node.textContent + " ";
                });
            }
        });

        // If specific text was altered, scan just that text
        if (textToScan.trim() && shouldAnalyze(textToScan)) {
            analyzeSecurity(textToScan.trim());
        } else {
            // Fallback: Scan the whole body just in case
            const bodyText = document.body.innerText;
            if (shouldAnalyze(bodyText)) analyzeSecurity(bodyText);
        }
    }, 1000);
});

function init() {
    if (!document.body) return;
    injectAgentUI();

    // Observe absolutely everything
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true, // Crucial for DevTools text edits!
        characterDataOldValue: true,
        attributes: true // Catches CSS changes meant to hide payloads
    });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
} else {
    window.addEventListener('load', init);
}

initSandboxWebSocket();
