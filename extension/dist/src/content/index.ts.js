import { injectAgentUI } from "/src/content/injectUI.tsx.js";
console.log("WebSec Agent: Content Script Active.");
const processedHashes = /* @__PURE__ */ new Set();
const sanitizeDOM = (textContext) => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while (node = walker.nextNode()) {
    if (node.textContent?.includes(textContext)) {
      const parent = node.parentElement;
      if (parent && parent.tagName !== "SCRIPT") {
        console.warn("[WebSec] Sanitizing suspicious node...");
        parent.style.filter = "blur(5px)";
        parent.style.pointerEvents = "none";
      }
    }
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
      // 1.5b models have context limits; 3k is plenty
    });
    if (response?.isMalicious) {
      console.error("WebSec Alert:", response.reason);
      sanitizeDOM(text);
      showSecurityBadge(response.reason);
    }
  } catch (err) {
    console.error("Communication error with Background Worker", err);
  }
}
function shouldAnalyze(text) {
  const triggers = ["ignore all previous", "system prompt", "dan mode", "<script>", "eval("];
  const lowerText = text.toLowerCase();
  return triggers.some((t) => lowerText.includes(t)) || text.length > 500;
}
let scanTimeout;
const observer = new MutationObserver(() => {
  clearTimeout(scanTimeout);
  scanTimeout = window.setTimeout(() => {
    const bodyText = document.body.innerText;
    if (shouldAnalyze(bodyText)) {
      analyzeSecurity(bodyText);
    }
  }, 1e3);
});
observer.observe(document.body, { childList: true, subtree: true });
window.addEventListener("load", () => {
  analyzeSecurity(document.body.innerText);
});
function showSecurityBadge(reason) {
  const badge = document.createElement("div");
  badge.style.cssText = "fixed; bottom: 20px; right: 20px; background: red; color: white; padding: 10px; z-index: 9999; border-radius: 8px; font-family: sans-serif;";
  badge.innerText = `⚠️ Threat Detected: ${reason}`;
  document.body.appendChild(badge);
}
window.addEventListener("load", () => {
  injectAgentUI();
});
