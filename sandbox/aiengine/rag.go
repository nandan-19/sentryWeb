package main

import (
	"fmt"
)

func telemetryToText(t *Telemetry) string {

	return fmt.Sprintf(
		"Visited domains: %v. External domains: %v. POST requests: %d",
		t.Domains,
		t.ExternalDomains,
		t.PostRequests,
	)
}

func buildRAGPrompt(t *Telemetry, similar string) string {

	return fmt.Sprintf(`
You are a browser security analyzer.

Current telemetry:
Domains: %v
External: %v
POST requests: %d

Similar past attacks:
%s

Determine if the behavior is malicious.

Return JSON:
{
 "risk": "low | medium | high",
 "reason": "...",
 "indicators": []
}
`,
		t.Domains,
		t.ExternalDomains,
		t.PostRequests,
		similar,
	)
}
