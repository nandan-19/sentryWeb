#!/bin/bash

URL=${1:-https://example.com}

echo "Starting sandbox for $URL"

mitmdump -s /sandbox/telemetry.py -p 8080 &

timeout 30 chromium \
  --headless \
  --disable-gpu \
  --no-sandbox \
  --disable-dev-shm-usage \
  --ignore-certificate-errors \
  --remote-debugging-port=9222 \
  --proxy-server=http://127.0.0.1:8080 \
  "$URL"
