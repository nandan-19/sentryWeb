import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: number;
}

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "WebSec Copilot active. Monitoring DOM, CSS, and Network.",
      sender: "bot",
      timestamp: Date.now(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages, isTyping]);

  const addBotMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        text,
        sender: "bot",
        timestamp: Date.now(),
      },
    ]);
  };

  useEffect(() => {
    const bgListener = (message: any) => {
      if (!message) return;

      if (message.type === "SECURITY_ALERT") {
        addBotMessage(`🚨 **NETWORK THREAT BLOCKED:**\n\n${message.payload}`);
        setIsOpen(true);
      }

      if (message.type === "SANDBOX_UPDATE") {
        addBotMessage(`🧪 **SENTRY SANDBOX:**\n\n${message.payload}`);
        setIsOpen(true);
      }
    };

    chrome.runtime.onMessage.addListener(bgListener);

    return () => {
      chrome.runtime.onMessage.removeListener(bgListener);
    };
  }, []);

  useEffect(() => {
    const domListener = (e: any) => {
      addBotMessage(`🚨 **DOM THREAT MITIGATED:**\n\n${e.detail}`);
      setIsOpen(true);
    };

    window.addEventListener("WEBSEC_DOM_ALERT", domListener);

    return () => {
      window.removeEventListener("WEBSEC_DOM_ALERT", domListener);
    };
  }, []);

  useEffect(() => {
    const sandboxListener = (event: any) => {
      if (!event?.detail) return;

      addBotMessage(`🧪 **SENTRY SANDBOX:**\n\n${event.detail}`);
      setIsOpen(true);
    };

    window.addEventListener("websec-sandbox-update", sandboxListener);

    return () => {
      window.removeEventListener("websec-sandbox-update", sandboxListener);
    };
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg = inputValue;

    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        text: userMsg,
        sender: "user",
        timestamp: Date.now(),
      },
    ]);

    setInputValue("");
    setIsTyping(true);

    const recentAlerts = messages
      .filter((m) => m.text.includes("🚨"))
      .map((m) => m.text)
      .join("\n");

    try {
      const response = await chrome.runtime.sendMessage({
        type: "CHAT_WITH_COPILOT",
        content: userMsg,
        context: recentAlerts,
      });

      if (response && response.reply) {
        addBotMessage(response.reply);
      }
    } catch (error) {
      addBotMessage("⚠️ Connection to background worker failed.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="copilot-root">
      <div
        className={`agent-bubble ${messages.some((m) => m.text.includes("🚨")) ? "danger" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {messages.some((m) => m.text.includes("🚨")) ? "⚠️" : "🛡️"}
      </div>

      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <span>WebSec Copilot</span>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                border: "none",
                background: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ✕
            </button>
          </div>

          <div className="message-list" ref={scrollRef}>
            {messages.map((m) => (
              <div key={m.id} className={`message-bubble ${m.sender}`}>
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  fontStyle: "italic",
                  paddingLeft: "5px",
                }}
              >
                Analyzing...
              </div>
            )}
          </div>

          <div className="chat-input-area">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about threats..."
              disabled={isTyping}
            />

            <button
              onClick={handleSend}
              disabled={isTyping}
              style={{
                background: isTyping ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "15px",
                padding: "10px 18px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
