package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

const qdrantURL = "http://localhost:6333"

func storeVector(id string, vector []float32, telemetry Telemetry) {

	point := map[string]interface{}{
		"points": []map[string]interface{}{
			{
				"id":     id,
				"vector": vector,
				"payload": map[string]interface{}{
					"domains": telemetry.Domains,
					"posts":   telemetry.PostRequests,
				},
			},
		},
	}

	body, _ := json.Marshal(point)

	http.Post(
		fmt.Sprintf("%s/collections/attacks/points", qdrantURL),
		"application/json",
		bytes.NewBuffer(body),
	)
}

func searchSimilar(vector []float32) []byte {

	query := map[string]interface{}{
		"vector": vector,
		"limit":  3,
	}

	body, _ := json.Marshal(query)

	resp, _ := http.Post(
		fmt.Sprintf("%s/collections/attacks/points/search", qdrantURL),
		"application/json",
		bytes.NewBuffer(body),
	)

	defer resp.Body.Close()

	data, _ := io.ReadAll(resp.Body)

	return data
}
