import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../agent-ui/App';

// Tell Vite to give us the CSS as a raw string
// Create a file at src/agent-ui/index.css if you haven't yet
import styles from '../agent-ui/index.css?inline';

export function injectAgentUI() {
    if (document.getElementById('websec-agent-container')) return;

    const host = document.createElement('div');
    host.id = 'websec-agent-container';
    document.body.appendChild(host);

    const shadowRoot = host.attachShadow({ mode: 'open' });

    // Inject the styles directly into the shadow root
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    shadowRoot.appendChild(styleSheet);

    const reactRoot = document.createElement('div');
    shadowRoot.appendChild(reactRoot);

    ReactDOM.createRoot(reactRoot).render(
        <React.StrictMode>
        <App />
        </React.StrictMode>
    );
}
