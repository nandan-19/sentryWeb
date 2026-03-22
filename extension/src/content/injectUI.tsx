import styles from '../agent-ui/index.css?inline';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../agent-ui/App';

export function injectAgentUI() {
    if (document.getElementById('websec-agent-container')) return;

    console.log("WebSec Agent: Injecting UI...");

    try {
        const host = document.createElement('div');
        host.id = 'websec-agent-container';
        host.style.position = 'fixed';
        host.style.bottom = '20px';
        host.style.right = '20px';
        host.style.zIndex = '2147483647';

        document.body.appendChild(host);

        const shadowRoot = host.attachShadow({ mode: 'open' });

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        shadowRoot.appendChild(styleSheet);

        const reactRoot = document.createElement('div');
        shadowRoot.appendChild(reactRoot);

        /* ------------------------------------------------ */
        /*  MESSAGE BRIDGE: background → content → React   */
        /* ------------------------------------------------ */

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

        /* ------------------------------------------------ */

        ReactDOM.createRoot(reactRoot).render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );

        console.log("WebSec Agent: UI Injected successfully.");

    } catch (err) {
        console.error("WebSec Agent: Failed to inject UI:", err);
    }
}
