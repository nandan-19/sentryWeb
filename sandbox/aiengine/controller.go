// sandbox/aiengine/controller.go
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/exec"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var clients = make(map[*websocket.Conn]bool)

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return
	}
	defer ws.Close()
	clients[ws] = true
	log.Println("Extension connected to WebSocket stream")

	for {
		_, _, err := ws.ReadMessage()
		if err != nil {
			delete(clients, ws)
			log.Println("Extension disconnected")
			break
		}
	}
}

func broadcast(message string) {
	log.Println("Broadcasting:", message)
	for client := range clients {
		err := client.WriteJSON(map[string]string{
			"type":    "SANDBOX_UPDATE",
			"payload": message,
		})
		if err != nil {
			client.Close()
			delete(clients, client)
		}
	}
}

type SandboxRequest struct {
	URL string `json:"url"`
}

func runSandbox(url string) error {
	cmd := exec.Command(
		"docker", "run",
		"--rm",
		"--cap-drop=ALL",
		"--security-opt", "no-new-privileges",
		"--name", "sentry-sandbox",
		"--network", "bridge",
		"-p", "9222:9222",
		"-p", "8080:8080",
		"-v", "../telemetry:/telemetry",
		"sentryweb-sandbox",
		url,
	)

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	return cmd.Run()
}

func waitForTelemetry() {
	for range 10 {
		if _, err := os.Stat("../telemetry/telemetry.json"); err == nil {
			return
		}
		time.Sleep(1 * time.Second)
	}
}

func runFullAnalysis(url string) {
	broadcast("🚀 **SENTRY CORE:** Spinning up isolated Docker sandbox for " + url)

	err := runSandbox(url)
	if err != nil {
		broadcast("⚠️ **Sandbox Error:** " + err.Error())
	}

	broadcast("🔍 Intercepting network telemetry and headless DOM events...")
	waitForTelemetry()
	time.Sleep(2 * time.Second) 

	telemetry, err := readTelemetry("../telemetry/telemetry.json")
	if err != nil {
		broadcast("⚠️ **Critical:** Failed to read telemetry dump.")
		return
	}

	broadcast("🧠 Generating threat embeddings and searching Vector DB...")
	features := extractFeatures(telemetry)
	text := featuresToText(features)
	vector, _ := generateEmbedding(text)

	similar := searchSimilar(vector)

	broadcast("🤖 **AI ANALYSIS:** Running Deep RAG comparison via Qwen2.5...")

	prompt := buildPrompt(telemetry, string(similar))

	finalReport := analyzeWithOllama(prompt)

	storeVector(uuid.New().String(), vector, *telemetry)

	broadcast("✅ **SANDBOX ANALYSIS COMPLETE**\n\n" + finalReport)
}

func handleSandboxTrigger(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		return
	}

	var req SandboxRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	go runFullAnalysis(req.URL)

	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "Analysis Started",
		"target": req.URL,
	})
}

func main() {
	http.HandleFunc("/analyze", handleSandboxTrigger)

	http.HandleFunc("/ws", handleConnections)

	port := ":8081"
	log.Printf("SentryWeb AI Engine active on http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
