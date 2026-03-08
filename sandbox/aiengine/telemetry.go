package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

type Telemetry struct {
	Domains         []string `json:"domains"`
	ExternalDomains []string `json:"external_domains"`
	PostRequests    int      `json:"post_requests"`
}

// Struct to parse the Ollama API response
type OllamaResponse struct {
	Response string `json:"response"`
}

func readTelemetry(path string) (*Telemetry, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var t Telemetry
	err = json.Unmarshal(data, &t)
	if err != nil {
		return nil, err
	}

	return &t, nil
}

func buildPrompt(t *Telemetry, similarAttacks string) string {
	return fmt.Sprintf(`
You are a cybersecurity sandbox analyzer.

### CURRENT TELEMETRY:
- Domains visited: %v
- External domains: %v
- POST requests: %d

### HISTORICAL CONTEXT (RAG):
%s

Determine if the current behavior matches known malicious patterns. 
Provide a detailed security report in Markdown.
`, t.Domains, t.ExternalDomains, t.PostRequests, similarAttacks)
}

// Updated to return string so it can be broadcasted via WebSocket
func analyzeWithOllama(prompt string) string {
	payload := map[string]any{
		"model":  "qwen2.5:1.5b",
		"prompt": prompt,
		"stream": false,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		log.Println("JSON marshal error:", err)
		return "⚠️ Internal error: Failed to prepare AI payload."
	}

	resp, err := http.Post(
		"http://localhost:11434/api/generate",
		"application/json",
		bytes.NewBuffer(body),
	)

	if err != nil {
		log.Println("Ollama request failed:", err)
		return "⚠️ AI Engine Offline: Ensure Ollama is running on port 11434."
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("Response read error:", err)
		return "⚠️ Error reading AI response."
	}

	var ollamaResp OllamaResponse
	if err := json.Unmarshal(data, &ollamaResp); err != nil {
		log.Println("JSON unmarshal error:", err)
		return "⚠️ Error parsing AI analysis."
	}

	return ollamaResp.Response
}
