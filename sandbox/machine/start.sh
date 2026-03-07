#!/bin/bash

# Start proxy
mitmdump -p 8080 &

# Start Chromium sandbox
chromium \
  --headless \
  --disable-gpu \
  --no-sandbox \
  --disable-dev-shm-usage \
  --remote-debugging-port=9222 \
  --proxy-server=http://127.0.0.1:8080 \
  https://example.com
