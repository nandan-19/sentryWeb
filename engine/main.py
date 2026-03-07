from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import ExtensionPayload, EngineDecision
import engine

app = FastAPI(title="SentryWeb Shield Engine")

# Allow the browser extension to talk to this local server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/analyze", response_model=EngineDecision)
async def analyze_endpoint(payload: ExtensionPayload):
    """Receives data from extension, processes it, and returns mitigation strategy."""
    decision = engine.process_payload(payload)
    return decision


if __name__ == "__main__":
    import uvicorn

    # Run server on port 8000
    uvicorn.run(app, host="127.0.0.1", port=8000)
