from mitmproxy import http
import json

telemetry = {
    "domains": set(),
    "external_domains": set(),
    "post_requests": 0
}

def write_telemetry():
    output = {
        "domains": list(telemetry["domains"]),
        "external_domains": list(telemetry["external_domains"]),
        "post_requests": telemetry["post_requests"]
    }

    with open("/telemetry/telemetry.json", "w") as f:
        json.dump(output, f, indent=2)

def request(flow: http.HTTPFlow):

    host = flow.request.host

    telemetry["domains"].add(host)
    telemetry["external_domains"].add(host)

    if flow.request.method == "POST":
        telemetry["post_requests"] += 1

    print("Captured:", host)

    write_telemetry()
