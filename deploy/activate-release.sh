#!/usr/bin/env bash
set -euo pipefail

RELEASE="${1:?usage: activate-release.sh <release-name>}"
APP_DIR="${APP_DIR:-/var/www/hammerload}"
PORT="${PORT:-4000}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"

[[ "$RELEASE" =~ ^[a-zA-Z0-9][a-zA-Z0-9_-]{0,100}$ ]] || { echo "Invalid release name"; exit 1; }
[[ "$APP_DIR" =~ ^/[a-zA-Z0-9_./-]+$ ]] || { echo "Invalid APP_DIR"; exit 1; }
[[ "$KEEP_RELEASES" =~ ^[0-9]+$ ]] && [ "$KEEP_RELEASES" -ge 2 ] || { echo "Keep at least two releases"; exit 1; }
[[ "$PORT" =~ ^[0-9]+$ ]] && [ "$PORT" -ge 1 ] && [ "$PORT" -le 65535 ] || { echo "Invalid port"; exit 1; }
APP_DIR="$(cd "$APP_DIR" && pwd -P)"
export APP_DIR PORT

exec 9>"$APP_DIR/.deploy.lock"
flock -w 120 9 || { echo "Another deployment holds the lock"; exit 1; }

RELEASE_DIR="$APP_DIR/releases/$RELEASE"
SHARED_ENV="$APP_DIR/shared/.env.production"
CURRENT="$APP_DIR/current"
[ -d "$RELEASE_DIR" ] && [ ! -L "$RELEASE_DIR" ] || { echo "Missing release directory"; exit 1; }
[ "$(cd "$RELEASE_DIR" && pwd -P)" = "$RELEASE_DIR" ] || { echo "Release path escapes releases"; exit 1; }
for required in dist/index.html server/index.js ecosystem.config.cjs; do
  [ -f "$RELEASE_DIR/$required" ] || { echo "Incomplete release: $required"; exit 1; }
done
[ -f "$SHARED_ENV" ] || { echo "Missing shared environment file"; exit 1; }
[ ! -e "$CURRENT" ] || [ -L "$CURRENT" ] || { echo "current must be a symlink"; exit 1; }
chmod 600 "$SHARED_ENV"
mkdir -p "$APP_DIR/shared/booking-security"
chmod 700 "$APP_DIR/shared/booking-security"
ln -sfn "$SHARED_ENV" "$RELEASE_DIR/.env.production"

PREVIOUS=""
if [ -L "$CURRENT" ]; then PREVIOUS="$(readlink -f "$CURRENT")"; fi
if [ -n "$PREVIOUS" ]; then
  case "$PREVIOUS" in "$APP_DIR/releases/"*) ;; *) echo "Invalid previous release path"; exit 1 ;; esac
  [ -f "$PREVIOUS/ecosystem.config.cjs" ] || { echo "Previous release is incomplete"; exit 1; }
  [ "$PREVIOUS" != "$RELEASE_DIR" ] || { echo "Release is already current"; exit 1; }
fi

switch_to() {
  ln -sfn "$1" "$APP_DIR/current.tmp" || return 1
  mv -Tf "$APP_DIR/current.tmp" "$CURRENT" || return 1
  pm2 startOrReload "$1/ecosystem.config.cjs" --update-env || return 1
}

health_check() {
  local expected="$1" body successes=0
  for _ in $(seq 1 15); do
    if body="$(curl -fsS --connect-timeout 2 --max-time 3 "http://127.0.0.1:$PORT/health")" &&
      node -e 'const h = JSON.parse(process.argv[1]); process.exit(h.ok === true && h.release === process.argv[2] ? 0 : 1)' "$body" "$expected" 2>/dev/null; then
      successes=$((successes + 1))
      [ "$successes" -ge 3 ] && return 0
    else
      successes=0
    fi
    sleep 1
  done
  return 1
}

rollback() {
  trap - HUP INT TERM
  if [ -n "$PREVIOUS" ] && [ "$PREVIOUS" != "$RELEASE_DIR" ]; then
    echo "Rolling back to $(basename "$PREVIOUS")"
    if switch_to "$PREVIOUS" && health_check "$(basename "$PREVIOUS")" && pm2 save > /dev/null; then
      echo "ROLLBACK_OK"
    else
      echo "ROLLBACK_FAILED: manual intervention required" >&2
    fi
  else
    pm2 delete hammerload > /dev/null 2>&1 || true
    rm -f "$CURRENT"
    pm2 save --force > /dev/null || true
    echo "FIRST_RELEASE_FAILED: no previous release to restore"
  fi
}

trap 'rollback; exit 1' HUP INT TERM
echo "Activating release $RELEASE"
if ! switch_to "$RELEASE_DIR" || ! health_check "$RELEASE" || ! pm2 save > /dev/null; then
  echo "Activation failed for $RELEASE"
  rollback
  exit 1
fi
trap - HUP INT TERM

# Never prune the live release or its immediate rollback target.
if ! node - "$APP_DIR/releases" "$RELEASE_DIR" "$PREVIOUS" "$KEEP_RELEASES" <<'NODE'
const fs = require('node:fs')
const path = require('node:path')
const [root, current, previous, count] = process.argv.slice(2)
const dirs = fs.readdirSync(root, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,100}$/.test(entry.name))
  .map(entry => path.join(root, entry.name))
  .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)
const keep = new Set([current, previous].filter(Boolean))
for (const dir of dirs) if (keep.size < Number(count)) keep.add(dir)
for (const dir of dirs) if (!keep.has(dir)) fs.rmSync(dir, { recursive: true })
NODE
then
  echo "Warning: release is live, but pruning failed" >&2
fi
echo "Release $RELEASE is live"
