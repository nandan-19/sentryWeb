import { useEffect, useState } from 'react';

function Success() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "http://localhost:5173";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{padding:"40px", textAlign: "center"}}>
      <div style={{maxWidth: "600px", margin: "0 auto"}}>
        <div style={{fontSize: "60px", color: "#28a745", marginBottom: "20px"}}>✓</div>
        <h1 style={{color: "#28a745", marginBottom: "20px"}}>Analysis Complete!</h1>
        <p style={{fontSize: "18px", color: "#666", marginBottom: "30px"}}>
          Your recipe analysis has been processed successfully. 
          All data has been collected and stored securely.
        </p>
        
        <div style={{backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "30px"}}>
          <h3 style={{margin: "0 0 10px 0", color: "#333"}}>What was analyzed:</h3>
          <ul style={{textAlign: "left", color: "#666"}}>
            <li>Recipe ingredients and nutritional values</li>
            <li>Cooking methods and preparation time</li>
            <li>Dietary restrictions and preferences</li>
            <li>User interaction patterns</li>
          </ul>
        </div>

        <div style={{marginBottom: "20px"}}>
          <p style={{color: "#666"}}>
            Returning to main page in <strong>{countdown}</strong> seconds...
          </p>
        </div>

        <button 
          onClick={() => window.location.href = "http://localhost:5173"}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Return to Recipe Blog
        </button>
      </div>
    </div>
  );
}

export default Success;
