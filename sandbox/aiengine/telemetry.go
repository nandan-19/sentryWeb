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

func buildPrompt(t *Telemetry) string {

	return fmt.Sprintf(`
You are a cybersecurity sandbox analyzer.

Domains visited: %v
External domains: %v
POST requests: %d

Determine if this behavior is suspicious.

Return JSON:
{
 "risk": "low | medium | high",
 "reason": "...",
 "indicators": []
}
`, t.Domains, t.ExternalDomains, t.PostRequests)
}

func analyzeWithOllama(prompt string) {

	payload := map[string]interface{}{
		"model":  "qwen:2.5b",
		"prompt": prompt,
		"stream": false,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		log.Println("JSON error:", err)
		return
	}

	resp, err := http.Post(
		"http://localhost:11434/api/generate",
		"application/json",
		bytes.NewBuffer(body),
	)

	if err != nil {
		log.Println("Ollama request failed:", err)
		return
	}

	defer resp.Body.Close()

	result, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("Failed reading response:", err)
		return
	}

	fmt.Println("AI Analysis Result:")
	fmt.Println(string(result))
}
