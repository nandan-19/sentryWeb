package main

import (
	"log"
	"os"
	"os/exec"
)

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

	log.Println("Launching sandbox for:", url)

	return cmd.Run()
}

func main() {

	if len(os.Args) < 2 {
		log.Println("Usage: go run . <url>")
		return
	}

	url := os.Args[1]

	err := runSandbox(url)
	if err != nil {
		log.Println("Sandbox error:", err)
		return
	}

	telemetry, err := readTelemetry("../telemetry/telemetry.json")
	if err != nil {
		log.Println("Failed to read telemetry:", err)
		return
	}

	prompt := buildPrompt(telemetry)

	analyzeWithOllama(prompt)
}
