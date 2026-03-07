import { useState, useEffect } from 'react';

const App = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [alerts, setAlerts] = useState<{ msg: string, type: string }[]>([]);

    useEffect(() => {
        // Listen for security alerts from the background/content scripts
        const listener = (message: any) => {
            if (message.type === "SECURITY_ALERT") {
                setAlerts(prev => [...prev, { msg: message.payload, type: 'danger' }]);
                setIsOpen(true); // Auto-expand on threat
            }
        };
        chrome.runtime.onMessage.addListener(listener);
        return () => chrome.runtime.onMessage.removeListener(listener);
    }, []);

    return (
        <div className="agent-root">
            <div
                className={`agent-bubble ${alerts.length > 0 ? 'danger' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {alerts.length > 0 ? '⚠️' : '🛡️'}
            </div>

            {isOpen && (
                <div className="dashboard-container">
                    <div className="dashboard-header">
                        <span>WebSec Agent</span>
                        <button onClick={() => setIsOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {alerts.length === 0 ? (
                            <div className="status-safe">Scanning for threats... System safe.</div>
                        ) : (
                            alerts.map((alert, i) => (
                                <div key={i} className="alert-item">{alert.msg}</div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
