# HammerLoad deployment and booking security

The site is served by one Node process inside Docker, behind host Nginx and
Cloudflare. Booking buttons, pages, dialogs and API routes are active. Submissions
require the configuration below; missing verification keys refuse delivery.

## Update the existing server

After the changes are pushed, run in `/var/www/hammerload-app`:

```bash
touch .env.production
bash deploy.sh
curl http://127.0.0.1:4000/health
```

The script pulls `origin/main` with `--ff-only`, builds with the current base image,
and waits for container health. It loads `.env.production` for Compose interpolation
as well as runtime variables. Existing secrets are not overwritten or printed.
Configure the email and Turnstile keys below before building and deploying.

The container port is published on **127.0.0.1 only**, not the public server IP.
It runs as the `node` user with a read-only filesystem, no Linux capabilities,
no privilege escalation, bounded resources and rotating logs. Its private quota
volume remains writable. The base image is Node 24.

Use the same host port as the existing deployment. For a custom port:

```bash
HOST_PORT=4010 bash deploy.sh
```

## Install the Nginx protections

The active config on this server is `/etc/nginx/conf.d/hammerload.conf`.
The repository's `nginx-hammerload.conf` now matches that setup: it preserves
ACME challenges, existing certificate paths and the www-to-apex redirect, and
routes the entire frontend to Docker rather than an old static directory.

Once the Docker update is healthy:

```bash
sudo bash scripts/install-nginx-security.sh
```

For another port, use `sudo env HOST_PORT=4010 bash scripts/install-nginx-security.sh`.
The script checks the existing configuration and certificates, downloads only
the official Cloudflare IPv4/IPv6 ranges, validates every CIDR, creates a backup
under `/root/hammerload-nginx-backup.*`, installs the snippets, runs `nginx -t`,
and reloads Nginx. On failure it restores the previous files.

Do not install a second HammerLoad virtual host under `sites-enabled`.
If this server's paths or domain change, adjust the installer before running it.
Refresh Cloudflare's trusted IP ranges by rerunning the installer when their
published ranges change. Review this repository's Nginx config before rerunning
if you have made custom server changes since installation.

The configuration trusts `CF-Connecting-IP` **only** from a published Cloudflare
TCP peer. Direct clients cannot supply a trusted client IP. Nginx overwrites
`X-Real-IP`, `X-Forwarded-For` and the forwarded host/protocol before proxying.
The site has connection limits, body/time limits and HSTS; booking has separate
per-IP and global rate limits returning HTTP 429.

## Application quotas

Sliding windows are checked atomically before side effects:

| Scope | Maximum |
| --- | --- |
| Attempts per IP | 5 per 15 minutes and 20 per 24 hours |
| Attempts across all clients | 120 per minute and 1,000 per hour |
| Deliveries per email address | 3 per hour and 5 per 24 hours |
| Deliveries across all clients | 30 per hour and 100 per 24 hours |
| In-flight booking requests | 8 |
| JSON body | 16 KiB, completed within 10 seconds |

IPv4-mapped IPv6 addresses share the IPv4 quota. IPv6 addresses in one /64 share
a quota to prevent address rotation within that network. Invalid inputs and
origins consume attempts too. Delivery reservations are spent even if sending
fails, so provider failures cannot bypass the limits. A 429 response includes
`Retry-After` with the remaining wait.

Docker stores hashed quota keys in its private `booking-security-state` volume.
Atomic file replacement preserves quotas across restarts. Corrupt, full or
unwritable storage refuses requests instead of resetting limits. Do not use
`docker compose down -v` during ordinary updates: that deletes the quota volume.

This deployment uses **one process and one replica**. The file store does not
coordinate multiple workers or containers. Before scaling, replace it with a
shared atomic store such as Redis. Nginx's limits already use shared memory across
its own workers. These limits reduce abuse; bot verification and perimeter
controls remain necessary for attackers who rotate networks and identities.

## Configure booking submissions

Set these variables in the server's private `.env.production`:

```env
RESEND_API_KEY=your_actual_resend_key
BOOKING_ALLOWED_ORIGINS=https://hammerload.com,https://www.hammerload.com
BOOKING_TRUSTED_PROXIES=the_actual_docker_gateway_ip
VITE_TURNSTILE_SITE_KEY=your_public_site_key
TURNSTILE_SECRET_KEY=your_private_secret_key
```

Find the Nginx TCP peer address for the single-network Docker deployment:

```bash
cd /var/www/hammerload-app
container_id=$(docker compose --env-file .env.production ps -q hammerload-web)
docker inspect --format '{{range .NetworkSettings.Networks}}{{.Gateway}}{{println}}{{end}}' "$container_id"
```

Put that exact gateway IP in `BOOKING_TRUSTED_PROXIES`. Do not trust `0.0.0.0/0`,
`::/0`, arbitrary client headers, or the entire Internet. Without a trusted
proxy entry, the application safely counts the TCP peer, but visitors behind
Nginx will share that peer's quota. The container only accepts `X-Real-IP` from
explicitly configured trusted peers; it never accepts a caller's forwarded chain.

In Cloudflare, create a Turnstile widget allowing `hammerload.com` and
`www.hammerload.com`. The public site key is passed into the frontend build;
the secret remains a runtime server variable and never has a `VITE_` prefix.
The form renders a widget with action `booking`, submits its token, clears expired
tokens and generates a new one after an unsuccessful submission. A hidden trap
field is also checked server-side.

The server validates every token against Cloudflare's fixed Siteverify endpoint
with a five-second timeout. It checks success, hostname, action and challenge
age. Tokens are single-use: Cloudflare rejects replays. Missing configuration,
invalid tokens and provider outages refuse delivery. Origin checks are an
additional browser safeguard, not authentication: a non-browser client can
forge an Origin header and must still pass the other protections.

The booking entry points are enabled in both languages, including service and
project buttons, the booking dialog, `/book`, `/ar/book`, and both API aliases.
Build and deploy after setting the keys. Changing the public site key requires
rebuilding the frontend. Missing keys do not disable the security checks: the
form displays an unavailable verification message and delivery is refused.

For local development, set `BOOKING_ALLOWED_ORIGINS` to the exact local origin
(for example `http://localhost:5173`), and use a Turnstile widget configured for
localhost. Production origins must use HTTPS. Keep local settings in a private
environment file rather than changing the production allowlist.

## Other protections

- Strict field types and allowed fields; explicit consent; allowed service,
  budget, duration and timeline values; offered meeting hours and weekdays.
- Name validation supports Arabic and other Unicode letters. Control characters
  and header injection are rejected. Submitted request types cannot change
  the server-generated email classification.
- Technical text in messages remains inert and HTML-escaped. Submitted URLs are
  never fetched and text is never evaluated as code or shell commands.
- Email has fixed sender/recipient and bounded delivery time. API failures do
  not disclose provider errors. Logs omit names, emails, bodies and tokens.
- Static files stay within the real build directory, including symlink checks;
  malformed paths return errors without crashing the process. Missing assets
  return 404, and unknown API paths return 404 for all methods.
- Responses have CSP, anti-framing, MIME-sniffing protection, referrer and browser
  permission policies. CSP preserves Google fonts, YouTube embeds, Turnstile,
  Cloudflare analytics and the app's inline styles, without allowing arbitrary
  inline scripts or eval. Any new external availability API must also be added
  deliberately to CSP before use.

## Verification

```bash
npm run test:server
npm run lint
npm run build
```

On the server after deployment:

```bash
docker compose --env-file .env.production ps
curl http://127.0.0.1:4000/health
curl -I --resolve hammerload.com:443:127.0.0.1 https://hammerload.com/
curl --resolve hammerload.com:443:127.0.0.1 https://hammerload.com/health
```

The health endpoint returns `{"ok":true}`. Booking API paths accept POST only:
GET returns 405, and POST without an allowed Origin returns 403 (or 429 after
the attempt limit). Check `/book`, `/ar/book`, the booking buttons, fonts,
project embeds and browser console
after installing the CSP. Keep the public Docker port closed; Nginx is the entry
point. For protection against traffic that overwhelms the server's network,
use the existing Cloudflare perimeter in addition to application-level limits.
