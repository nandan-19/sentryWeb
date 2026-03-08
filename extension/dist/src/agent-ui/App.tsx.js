import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/agent-ui/App.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--90b93522.js"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/vendor/.vite-deps-react.js__v--90b93522.js"; const useState = __vite__cjsImport1_react["useState"]; const useEffect = __vite__cjsImport1_react["useEffect"]; const useRef = __vite__cjsImport1_react["useRef"];
import ReactMarkdown from "/vendor/.vite-deps-react-markdown.js__v--90b93522.js";
const App = () => {
  _s();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(
    [
      { id: "1", text: "WebSec Copilot active. Monitoring DOM, CSS, and Network.", sender: "bot", timestamp: Date.now() }
    ]
  );
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => {
    const bgListener = (message) => {
      if (message.type === "SECURITY_ALERT") {
        addBotMessage(`🚨 **NETWORK THREAT BLOCKED:**

${message.payload}`);
        setIsOpen(true);
      }
    };
    chrome.runtime.onMessage.addListener(bgListener);
    const domListener = (e) => {
      addBotMessage(`🚨 **DOM THREAT MITIGATED:**

${e.detail}`);
      setIsOpen(true);
    };
    window.addEventListener("WEBSEC_DOM_ALERT", domListener);
    return () => {
      chrome.runtime.onMessage.removeListener(bgListener);
      window.removeEventListener("WEBSEC_DOM_ALERT", domListener);
    };
  }, []);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, isTyping]);
  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { id: Math.random().toString(), text, sender: "bot", timestamp: Date.now() }]);
  };
  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;
    const userMsg = inputValue;
    setMessages((prev) => [...prev, { id: Math.random().toString(), text: userMsg, sender: "user", timestamp: Date.now() }]);
    setInputValue("");
    setIsTyping(true);
    const recentAlerts = messages.filter((m) => m.text.includes("🚨")).map((m) => m.text).join("\n");
    try {
      const response = await chrome.runtime.sendMessage({
        type: "CHAT_WITH_COPILOT",
        content: userMsg,
        context: recentAlerts
        // This passes the blocked threats to Ollama!
      });
      if (response && response.reply) {
        addBotMessage(response.reply);
      }
    } catch (error) {
      addBotMessage("Connection to background worker failed.");
    } finally {
      setIsTyping(false);
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "copilot-root", children: [
    /* @__PURE__ */ jsxDEV("div", { className: `agent-bubble ${messages.some((m) => m.text.includes("🚨")) ? "danger" : ""}`, onClick: () => setIsOpen(!isOpen), children: messages.some((m) => m.text.includes("🚨")) ? "⚠️" : "🛡️" }, void 0, false, {
      fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
      lineNumber: 81,
      columnNumber: 13
    }, this),
    isOpen && /* @__PURE__ */ jsxDEV("div", { className: "chat-container", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "chat-header", children: [
        /* @__PURE__ */ jsxDEV("span", { children: "WebSec Copilot" }, void 0, false, {
          fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
          lineNumber: 88,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("button", { onClick: () => setIsOpen(false), style: { border: "none", background: "none", color: "white", cursor: "pointer", fontSize: "18px" }, children: "✕" }, void 0, false, {
          fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
          lineNumber: 89,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
        lineNumber: 87,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "message-list", ref: scrollRef, children: [
        messages.map(
          (m) => /* @__PURE__ */ jsxDEV("div", { className: `message-bubble ${m.sender}`, children: /* @__PURE__ */ jsxDEV(ReactMarkdown, { children: m.text }, void 0, false, {
            fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
            lineNumber: 96,
            columnNumber: 33
          }, this) }, m.id, false, {
            fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
            lineNumber: 94,
            columnNumber: 11
          }, this)
        ),
        isTyping && /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "12px", color: "#666", fontStyle: "italic", paddingLeft: "5px" }, children: "Analyzing..." }, void 0, false, {
          fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
          lineNumber: 99,
          columnNumber: 38
        }, this)
      ] }, void 0, true, {
        fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
        lineNumber: 92,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "chat-input-area", children: [
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            value: inputValue,
            onChange: (e) => setInputValue(e.target.value),
            onKeyPress: (e) => e.key === "Enter" && handleSend(),
            placeholder: "Ask about threats...",
            disabled: isTyping
          },
          void 0,
          false,
          {
            fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
            lineNumber: 103,
            columnNumber: 25
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("button", { onClick: handleSend, disabled: isTyping, style: { background: isTyping ? "#ccc" : "#007bff", color: "white", border: "none", borderRadius: "15px", padding: "10px 18px", cursor: "pointer" }, children: "Send" }, void 0, false, {
          fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
          lineNumber: 110,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
        lineNumber: 102,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
      lineNumber: 86,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/home/raun/raundev/sentryWeb/extension/src/agent-ui/App.tsx",
    lineNumber: 80,
    columnNumber: 5
  }, this);
};
_s(App, "nTemSyl+PTBd+uqQ/NOx/s7gyKs=");
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
