import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--90b93522.js"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import styles from "/src/agent-ui/index.css__inline.js";
import __vite__cjsImport2_react from "/vendor/.vite-deps-react.js__v--90b93522.js"; const React = __vite__cjsImport2_react.__esModule ? __vite__cjsImport2_react.default : __vite__cjsImport2_react;
import __vite__cjsImport3_reactDom_client from "/vendor/.vite-deps-react-dom_client.js__v--90b93522.js"; const ReactDOM = __vite__cjsImport3_reactDom_client.__esModule ? __vite__cjsImport3_reactDom_client.default : __vite__cjsImport3_reactDom_client;
import App from "/src/agent-ui/App.tsx.js";
export function injectAgentUI() {
  if (document.getElementById("websec-agent-container")) return;
  console.log("WebSec Agent: Injecting UI...");
  try {
    const host = document.createElement("div");
    host.id = "websec-agent-container";
    host.style.position = "fixed";
    host.style.bottom = "20px";
    host.style.right = "20px";
    host.style.zIndex = "2147483647";
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: "open" });
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    shadowRoot.appendChild(styleSheet);
    const reactRoot = document.createElement("div");
    shadowRoot.appendChild(reactRoot);
    chrome.runtime.onMessage.addListener((message) => {
      if (message?.type === "SANDBOX_UPDATE") {
        console.log("WebSec Agent: Sandbox update received", message.payload);
        window.dispatchEvent(
          new CustomEvent("websec-sandbox-update", {
            detail: message.payload
          })
        );
      }
    });
    ReactDOM.createRoot(reactRoot).render(
      /* @__PURE__ */ jsxDEV(React.StrictMode, { children: /* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
        fileName: "/home/raun/raundev/sentryWeb/extension/src/content/injectUI.tsx",
        lineNumber: 50,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "/home/raun/raundev/sentryWeb/extension/src/content/injectUI.tsx",
        lineNumber: 49,
        columnNumber: 7
      }, this)
    );
    console.log("WebSec Agent: UI Injected successfully.");
  } catch (err) {
    console.error("WebSec Agent: Failed to inject UI:", err);
  }
}
