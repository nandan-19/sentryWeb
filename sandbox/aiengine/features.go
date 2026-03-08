package main

import (
	"fmt"
	"strings"
)

type Features struct {
	DomainCount   int
	ExternalCount int
	PostRequests  int
	SuspiciousTLD bool
	LoginKeyword  bool
}

func extractFeatures(t *Telemetry) Features {

	f := Features{}

	f.DomainCount = len(t.Domains)
	f.ExternalCount = len(t.ExternalDomains)
	f.PostRequests = t.PostRequests

	for _, d := range t.Domains {

		if strings.Contains(d, "login") ||
			strings.Contains(d, "auth") ||
			strings.Contains(d, "verify") {
			f.LoginKeyword = true
		}

		if strings.HasSuffix(d, ".xyz") ||
			strings.HasSuffix(d, ".top") ||
			strings.HasSuffix(d, ".ru") {
			f.SuspiciousTLD = true
		}
	}

	return f
}

func featuresToText(f Features) string {

	return fmt.Sprintf(`
Domain count: %d
External domains: %d
POST requests: %d
Suspicious TLD: %v
Login keywords detected: %v
`,
		f.DomainCount,
		f.ExternalCount,
		f.PostRequests,
		f.SuspiciousTLD,
		f.LoginKeyword,
	)
}
