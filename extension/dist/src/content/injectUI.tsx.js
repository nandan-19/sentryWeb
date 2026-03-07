import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--667f1104.js"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/vendor/.vite-deps-react.js__v--667f1104.js"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react;
import __vite__cjsImport2_reactDom_client from "/vendor/.vite-deps-react-dom_client.js__v--57a019e4.js"; const ReactDOM = __vite__cjsImport2_reactDom_client.__esModule ? __vite__cjsImport2_reactDom_client.default : __vite__cjsImport2_reactDom_client;
import App from "/src/agent-ui/App.tsx.js";
import styles from "/src/agent-ui/index.css__inline.js";
export function injectAgentUI() {
  if (document.getElementById("websec-agent-container")) return;
  const host = document.createElement("div");
  host.id = "websec-agent-container";
  document.body.appendChild(host);
  const shadowRoot = host.attachShadow({ mode: "open" });
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  shadowRoot.appendChild(styleSheet);
  const reactRoot = document.createElement("div");
  shadowRoot.appendChild(reactRoot);
  ReactDOM.createRoot(reactRoot).render(
    /* @__PURE__ */ jsxDEV(React.StrictMode, { children: /* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
      fileName: "/home/raun/raundev/sentryWeb/extension/src/content/injectUI.tsx",
      lineNumber: 28,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/home/raun/raundev/sentryWeb/extension/src/content/injectUI.tsx",
      lineNumber: 27,
      columnNumber: 5
    }, this)
  );
}
