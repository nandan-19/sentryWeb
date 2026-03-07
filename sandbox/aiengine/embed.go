package main

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
)

type EmbedResponse struct {
	Embedding []float32 `json:"embedding"`
}

func generateEmbedding(text string) ([]float32, error) {

	payload := map[string]interface{}{
		"model":  "nomic-embed-text",
		"prompt": text,
	}

	body, _ := json.Marshal(payload)

	resp, err := http.Post(
		"http://localhost:11434/api/embeddings",
		"application/json",
		bytes.NewBuffer(body),
	)

	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	data, _ := io.ReadAll(resp.Body)

	var result EmbedResponse
	json.Unmarshal(data, &result)

	return result.Embedding, nil
}
