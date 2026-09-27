#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run with sudo: sudo bash scripts/install-nginx-security.sh"
  exit 1
fi
project_dir="$(cd "$(dirname "$0")/.." && pwd)"
config=/etc/nginx/conf.d/hammerload.conf
staging_dir="$(mktemp -d)"
backup_dir="$(mktemp -d /root/hammerload-nginx-backup.XXXXXX)"
trap 'rm -rf "$staging_dir"' EXIT

command -v nginx >/dev/null
command -v python3 >/dev/null
nginx -t
if [ ! -f "$config" ]; then
  echo "Expected active config at $config; refusing to install a duplicate server."
  exit 1
fi
if [ ! -f /etc/letsencrypt/live/hammerload.com/fullchain.pem ] || [ ! -f /etc/letsencrypt/live/hammerload.com/privkey.pem ]; then
  echo "Existing hammerload.com certificates are required."
  exit 1
fi

# Download only the official IP lists; validate every CIDR before trusting it.
python3 - "$staging_dir/hammerload-cloudflare.conf" <<'PY'
import ipaddress
import json
import sys
import urllib.request

ranges = []
url = 'https://api.cloudflare.com/client/v4/ips'
request = urllib.request.Request(url, headers={'Accept': 'application/json', 'User-Agent': 'HammerLoad-Deployment/1.0'})
with urllib.request.urlopen(request, timeout=15) as response:
    if response.url != url:
        raise SystemExit('Unexpected Cloudflare redirect')
    raw = response.read(65537)
    if len(raw) > 65536:
        raise SystemExit('Cloudflare response is too large')
    payload = json.loads(raw)
if payload.get('success') is not True or not isinstance(payload.get('result'), dict):
    raise SystemExit('Invalid Cloudflare IP response')
for version in (4, 6):
    values = payload['result'].get(f'ipv{version}_cidrs')
    if not isinstance(values, list) or not 1 <= len(values) <= 100:
        raise SystemExit('Empty or invalid Cloudflare IP list')
    for value in values:
        network = ipaddress.ip_network(value.strip(), strict=True)
        if network.version != version or network.prefixlen == 0 or not network.is_global:
            raise SystemExit('Invalid Cloudflare network')
        ranges.append(str(network))
with open(sys.argv[1], 'w') as output:
    output.write('# Generated from the official Cloudflare IPv4/IPv6 lists.\n')
    for network in ranges:
        output.write(f'set_real_ip_from {network};\n')
    output.write('real_ip_header CF-Connecting-IP;\nreal_ip_recursive off;\n')
PY

cp -a "$config" "$backup_dir/hammerload.conf"
mkdir -p /etc/nginx/snippets
for snippet in hammerload-booking.conf hammerload-cloudflare.conf; do
  if [ -f "/etc/nginx/snippets/$snippet" ]; then
    cp -a "/etc/nginx/snippets/$snippet" "$backup_dir/$snippet"
  fi
done

rollback() {
  cp -a "$backup_dir/hammerload.conf" "$config"
  for snippet in hammerload-booking.conf hammerload-cloudflare.conf; do
    if [ -f "$backup_dir/$snippet" ]; then
      cp -a "$backup_dir/$snippet" "/etc/nginx/snippets/$snippet"
    else
      rm -f "/etc/nginx/snippets/$snippet"
    fi
  done
  echo "Restored the previous files. Backup: $backup_dir"
}

# The default upstream is 4000, matching this deployment. Keep a custom port
# consistent across the frontend and booking snippets when HOST_PORT is set.
proxy_port="${HOST_PORT:-4000}"
if ! [[ "$proxy_port" =~ ^[0-9]+$ ]] || [ "$proxy_port" -lt 1 ] || [ "$proxy_port" -gt 65535 ]; then
  echo "Invalid HOST_PORT"
  exit 1
fi
sed "s/127.0.0.1:4000/127.0.0.1:$proxy_port/g" "$project_dir/nginx-hammerload.conf" > "$staging_dir/hammerload.conf"
sed "s/127.0.0.1:4000/127.0.0.1:$proxy_port/g" "$project_dir/nginx/snippets/hammerload-booking.conf" > "$staging_dir/hammerload-booking.conf"

trap 'rollback; rm -rf "$staging_dir"' ERR
install -m 644 "$staging_dir/hammerload.conf" "$config"
install -m 644 "$staging_dir/hammerload-booking.conf" /etc/nginx/snippets/hammerload-booking.conf
install -m 644 "$staging_dir/hammerload-cloudflare.conf" /etc/nginx/snippets/hammerload-cloudflare.conf
nginx -t
systemctl reload nginx
trap - ERR
echo "Nginx security configuration installed. Backup: $backup_dir"
