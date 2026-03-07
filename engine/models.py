from pydantic import BaseModel, Field, field_validator
from typing import List, Union, Dict


# --- INCOMING FROM EXTENSION ---
class ShadowNode(BaseModel):
    host: str
    content: str


class CssFlag(BaseModel):
    selector: str
    flags: List[str]


class NetworkRequest(BaseModel):
    method: str
    url: str


class ExtensionPayload(BaseModel):
    session_id: str
    url: str
    timestamp: str
    dom_snapshot: str
    shadow_dom_nodes: List[ShadowNode] = []
    computed_css_flags: List[CssFlag] = []
    network_requests: List[NetworkRequest] = []
    event_listeners: List[str] = []
    base64_payloads: List[str] = []


# --- OUTGOING TO EXTENSION ---


class MitigationStrategy(BaseModel):
    strip_selectors: List[str] = []
    # We change this to allow either a string OR a dictionary
    block_urls: List[Union[str, Dict[str, str]]] = []

    @field_validator("block_urls")
    @classmethod
    def flatten_urls(cls, v):
        """
        If Ollama sends [{'url': 'http://...'}], this converts it to ['http://...']
        so the extension receives a clean list of strings.
        """
        flattened = []
        for item in v:
            if isinstance(item, dict):
                # Grab the first value in the dict (usually the URL)
                flattened.append(list(item.values())[0])
            else:
                flattened.append(item)
        return flattened


class EngineDecision(BaseModel):
    threat_level: int = Field(ge=0, le=10)
    attack_categories: List[str] = []
    confidence: float = Field(ge=0.0, le=1.0)
    action: str  # Must be: 'allow', 'sanitize', 'block', or 'delegate_to_sandbox'
    mitigation: MitigationStrategy
    reasoning: str
