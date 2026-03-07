import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/agent-ui/App.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--6864ab97.js"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/vendor/.vite-deps-react.js__v--6864ab97.js"; const useState = __vite__cjsImport1_react["useState"]; const useEffect = __vite__cjsImport1_react["useEffect"];
const App = () => {
  _s();
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    const listener = (message) => {
      if (message.type === "SECURITY_ALERT") {
        setAlerts((prev) => [...prev, { msg: message.payload, type: "danger" }]);
        setIsOpen(true);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);
  return /* @__PURE__ */ jsxDEV("div", { className: "agent-root", children: [
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: `agent-bubble ${alerts.length > 0 ? "danger" : ""}`,
        onClick: () => setIsOpen(!isOpen),
        children: alerts.length > 0 ? "⚠️" : "🛡️"
      },
      void 0,
      false,
      {
        fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
        lineNumber: 21,
        columnNumber: 13
      },
      this
    ),
    isOpen && /* @__PURE__ */ jsxDEV("div", { className: "dashboard-container", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "dashboard-header", children: [
        /* @__PURE__ */ jsxDEV("span", { children: "WebSec Agent" }, void 0, false, {
          fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
          lineNumber: 31,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("button", { onClick: () => setIsOpen(false), style: { border: "none", background: "none", cursor: "pointer" }, children: "✕" }, void 0, false, {
          fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
          lineNumber: 32,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
        lineNumber: 30,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("div", { style: { overflowY: "auto", flex: 1 }, children: alerts.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "status-safe", children: "Scanning for threats... System safe." }, void 0, false, {
        fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
        lineNumber: 36,
        columnNumber: 11
      }, this) : alerts.map(
        (alert, i) => /* @__PURE__ */ jsxDEV("div", { className: "alert-item", children: alert.msg }, i, false, {
          fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
          lineNumber: 39,
          columnNumber: 11
        }, this)
      ) }, void 0, false, {
        fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
        lineNumber: 34,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
      lineNumber: 29,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
    lineNumber: 20,
    columnNumber: 5
  }, this);
};
_s(App, "si7bghtSxICPv1TVhDIr85Z+y9I=");
_c = App;
export default App;
var _c;
$RefreshReg$(_c, "App");
import * as RefreshRuntime from "/vendor/react-refresh.js";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}
