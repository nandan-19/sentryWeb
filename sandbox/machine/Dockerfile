FROM debian:12

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
    dnsutils \
    mitmproxy \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /sandbox

COPY start.sh /sandbox/start.sh
COPY telemetry.py /sandbox/telemetry.py

# install mitmproxy CA
COPY mitmproxy-ca-cert.pem /usr/local/share/ca-certificates/mitmproxy-ca-cert.crt
RUN update-ca-certificates

RUN chmod +x /sandbox/start.sh

ENTRYPOINT ["/sandbox/start.sh"]
