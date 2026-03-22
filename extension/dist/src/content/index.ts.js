import { injectAgentUI } from "/src/content/injectUI.tsx.js";
import { initSandboxWebSocket } from "/src/background/api.ts.js";
console.log("WebSec Agent: Aggressive DOM Scanner Active.");
const processedHashes = /* @__PURE__ */ new Set();
const sanitizeDOM = (maliciousText, reason) => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  let mitigated = false;
  const matchTarget = maliciousText.trim().substring(0, 30);
  while (node = walker.nextNode()) {
    if (node.textContent && node.textContent.includes(matchTarget)) {
      const parent = node.parentElement;
      if (parent && !parent.closest("#websec-agent-container") && parent.tagName !== "SCRIPT") {
        console.warn(`[WebSec] MITIGATION ENGAGED: Removing threat...`);
        parent.style.filter = "blur(10px) grayscale(100%)";
        parent.style.pointerEvents = "none";
        parent.style.userSelect = "none";
        parent.style.border = "3px dashed red";
        parent.setAttribute("title", `Blocked by WebSec: ${reason}`);
        mitigated = true;
      }
    }
  }
  if (mitigated) {
    window.dispatchEvent(new CustomEvent("WEBSEC_DOM_ALERT", {
      detail: `I just neutralized an element containing:

> "${matchTarget}..."

**Reason:** ${reason}`
    }));
  }
};
async function analyzeSecurity(text) {
  const contentHash = text.slice(0, 100);
  if (processedHashes.has(contentHash)) return;
  processedHashes.add(contentHash);
  try {
    const response = await chrome.runtime.sendMessage({
      type: "ANALYZE_DOM",
      content: text.slice(0, 3e3)
    });
    if (response?.isMalicious) {
      sanitizeDOM(text, response.reason);
    }
  } catch (err) {
    console.error("Communication error", err);
  }
}
function shouldAnalyze(text) {
  const triggers = ["ignore", "previous", "system prompt", "override", "dan mode"];
  const lowerText = text.toLowerCase();
  return triggers.some((t) => lowerText.includes(t)) && text.length > 20;
}
let scanTimeout;
const observer = new MutationObserver((mutations) => {
  clearTimeout(scanTimeout);
  scanTimeout = window.setTimeout(() => {
    let textToScan = "";
    mutations.forEach((m) => {
      if (m.type === "characterData" && m.target.textContent) {
        textToScan += m.target.textContent + " ";
      } else if (m.type === "childList") {
        m.addedNodes.forEach((node) => {
          if (node.textContent) textToScan += node.textContent + " ";
        });
      }
    });
    if (textToScan.trim() && shouldAnalyze(textToScan)) {
      analyzeSecurity(textToScan.trim());
    } else {
      const bodyText = document.body.innerText;
      if (shouldAnalyze(bodyText)) analyzeSecurity(bodyText);
    }
  }, 1e3);
});
function init() {
  if (!document.body) return;
  injectAgentUI();
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    // Crucial for DevTools text edits!
    characterDataOldValue: true,
    attributes: true
    // Catches CSS changes meant to hide payloads
  });
}
if (document.readyState === "complete" || document.readyState === "interactive") {
  init();
} else {
  window.addEventListener("load", init);
}
initSandboxWebSocket();
