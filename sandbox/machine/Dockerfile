FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    chromium \
    wget \
    curl \
    tcpdump \
    python3 \
    python3-pip \
    ca-certificates \
    fonts-liberation \
    libnss3 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libgtk-3-0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    net-tools \
    iproute2 \
    dnsutils

RUN pip3 install mitmproxy

WORKDIR /sandbox

EXPOSE 9222
EXPOSE 8080

CMD mitmdump -p 8080 & \
    chromium \
    --headless \
    --disable-gpu \
    --no-sandbox \
    --disable-dev-shm-usage \
    --remote-debugging-port=9222 \
    --proxy-server=http://127.0.0.1:8080 \
    https://example.com
