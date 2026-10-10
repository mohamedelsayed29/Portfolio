#!/usr/bin/env bash
# Run once as an administrator on a NEW Ubuntu 24.04 Lightsail/EC2 instance.
set -euo pipefail

APP_DIR="/var/www/hammerload"
APP_USER="hammerload"
[ "$(id -u)" -ne 0 ] || { echo "Run as ubuntu, not root"; exit 1; }
. /etc/os-release
[ "$ID" = ubuntu ] && [ "$VERSION_ID" = 24.04 ] || { echo "Ubuntu 24.04 required"; exit 1; }
[ "$(uname -m)" = x86_64 ] || { echo "The GitHub artifact requires an x86_64 instance"; exit 1; }

sudo apt-get update
sudo apt-get install -y curl ca-certificates nginx util-linux
if ! command -v node > /dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" != 24 ]; then
  installer="$(mktemp)"
  trap 'rm -f "$installer"' EXIT
  curl -fsSL https://deb.nodesource.com/setup_24.x -o "$installer"
  sudo bash "$installer"
  sudo apt-get install -y nodejs
fi
sudo npm install -g pm2@7.0.4

if ! id "$APP_USER" > /dev/null 2>&1; then
  sudo useradd --create-home --shell /bin/bash "$APP_USER"
fi
if id -nG "$APP_USER" | tr ' ' '\n' | grep -Eq '^(sudo|docker|lxd)$'; then
  echo "The app user must not have administrative groups" >&2
  exit 1
fi
sudo install -d -o "$APP_USER" -g "$APP_USER" -m 755 "$APP_DIR" "$APP_DIR/releases"
sudo install -d -o "$APP_USER" -g "$APP_USER" -m 700 "$APP_DIR/shared" "$APP_DIR/incoming" "/home/$APP_USER/.ssh"
sudo install -d -o "$APP_USER" -g "$APP_USER" -m 700 "$APP_DIR/shared/booking-security"
sudo -u "$APP_USER" -H pm2 install pm2-logrotate
sudo -u "$APP_USER" -H pm2 set pm2-logrotate:max_size 10M
sudo -u "$APP_USER" -H pm2 set pm2-logrotate:retain 14
sudo env PATH="$PATH:/usr/bin" pm2 startup systemd -u "$APP_USER" --hp "/home/$APP_USER"
sudo -u "$APP_USER" -H pm2 save --force

if [ ! -f "$APP_DIR/shared/.env.production" ]; then
  printf '%s\n' 'RESEND_API_KEY=' 'BOOKING_ALLOWED_ORIGINS=https://hammerload.com,https://www.hammerload.com' |
    sudo -u "$APP_USER" tee "$APP_DIR/shared/.env.production" > /dev/null
fi
sudo chmod 600 "$APP_DIR/shared/.env.production"
echo "Setup complete. Fill the private environment file, configure the dedicated SSH key and TLS, then deploy."
