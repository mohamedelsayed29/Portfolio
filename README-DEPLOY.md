# HammerLoad: Lightsail, PM2 and GitHub Actions

No Docker. GitHub builds and packages on Ubuntu 24.04 x86_64 with Node 24.
The server only extracts the production bundle and activates it: no install
or build during deployments. PRs run lint, server/deployment tests and build.
Main pushes/manual runs deploy only when repository variable `DEPLOY_ENABLED`
is `true`. Leave it unset until the new server is ready.

## 1. Separate instance and verified SSH

- Lightsail, Frankfurt, OS Only, Ubuntu 24.04 x86_64, IPv4-enabled plan.
- Start with 1 GB RAM and monitor actual usage after deployment.
- Attach a NEW Static IP to HammerLoad; never detach BioReza's IP.
- Allow TCP 80/443. Restrict SSH 22 where practical, retaining browser SSH.
  GitHub-hosted runner source addresses are not one fixed IP.
- Do not expose port 4000: Node binds to loopback.
- EC2 also works using Elastic IP/Security Groups. ARM instances are NOT
  supported by this workflow's x86_64 production dependency bundle.

In the new Lightsail browser SSH console, get the trusted fingerprint:

```bash
sudo ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

Locally, collect a candidate and compare its SHA256 fingerprint exactly before
using it. `ssh-keyscan` alone does not authenticate the server:

```bash
ssh-keyscan -t ed25519 <STATIC_IP> > hammerload_known_hosts.candidate
ssh-keygen -lf hammerload_known_hosts.candidate
```

After a match, rename it to `hammerload_known_hosts`. Use this file with
`UserKnownHostsFile` and `StrictHostKeyChecking=yes` for SSH/SCP throughout.

## 2. One-time setup on the NEW server

Copy `deploy/setup-server.sh` through the verified administrator connection
and run `bash ~/setup-server.sh` as `ubuntu`, not root.
It installs Node 24, PM2/log rotation and Nginx, creates unprivileged user
`hammerload`, and enables that user's saved PM2 process list at boot.
The app user has no sudo privileges; administration still uses `ubuntu`.

```text
/var/www/hammerload/
  current -> releases/<run>-<attempt>-<sha>
  releases/                  # five, including the rollback target
  incoming/                  # private upload staging
  shared/.env.production     # mode 600, owner hammerload
```

Privately transfer the old container's `RESEND_API_KEY` and
`BOOKING_ALLOWED_ORIGINS` over verified SSH. Do not post secrets in chat, git,
command arguments or CI logs. Edit as the app user when needed:

```bash
sudo -u hammerload nano /var/www/hammerload/shared/.env.production
sudo chmod 600 /var/www/hammerload/shared/.env.production
```

Check old writable container files and mounts before assuming there is no
persistent data. The running container may have values absent from its env file.

## 3. Dedicated CI key and GitHub environment

Generate a NEW key only for HammerLoad, not BioReza or administrator access:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/hammerload_actions -N '' -C hammerload-actions
```

Install its PUBLIC key as a `restrict` entry in the new server's
`/home/hammerload/.ssh/authorized_keys`. Directory/file modes are 700/600,
owner `hammerload`. This disables forwarding and PTY allocation but permits
deployment commands. The private key can execute code as the app user.

Create GitHub environment `production`, restrict it to `main`, and enable
required reviewers where supported, particularly for initial deployment.
Set these environment secrets (the existing EC2 names also work on Lightsail):

| Secret | Value |
| --- | --- |
| `EC2_HOST` | HammerLoad's NEW Static IP |
| `EC2_USER` | `hammerload` |
| `EC2_SSH_KEY` | Dedicated HammerLoad private deploy key |
| `EC2_KNOWN_HOSTS` | Verified ED25519 known-hosts line |
| `EC2_PORT` | Optional, default `22` |

Optional repository variable `VITE_API_URL` is normally empty for same-origin
API calls. Never put secrets in `VITE_*`, which become public browser JS.
Set repository variable `DEPLOY_ENABLED=true` only after setup and SSH testing.
Review changes before committing/pushing; an enabled main push then deploys.

## 4. Deploy BEFORE changing DNS

Run the workflow on `main` while the old site remains online. It verifies the
artifact checksum, extracts to a fresh release directory, locks activation,
switches `current`, reloads PM2 through a stable symlink path and checks that
`/health` reports the executing module's real release for three consecutive probes.
CI also tests real PM2 activation twice and verifies rollback from a deliberately
broken release in an isolated PM2_HOME. PM2/health failures restore and verify the previous release. A failed FIRST
deployment stops the new app because no previous release exists.

```bash
sudo -u hammerload -H pm2 status
curl -fsS http://127.0.0.1:4000/health
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4000/
```

## 5. Configure HTTPS BEFORE changing DNS

This Nginx template expects a NEW Cloudflare Origin CA certificate for
`hammerload.com` and `*.hammerload.com`, NOT BioReza's certificate.
Generate a private key/CSR on the new server, keeping the private key there:

```bash
sudo install -d -m 755 /etc/ssl/cloudflare
sudo bash -c 'umask 077; openssl req -new -newkey rsa:2048 -nodes \
  -keyout /etc/ssl/cloudflare/hammerload-origin.key \
  -out /etc/ssl/cloudflare/hammerload-origin.csr \
  -subj "/CN=hammerload.com" \
  -addext "subjectAltName=DNS:hammerload.com,DNS:*.hammerload.com"'
sudo cat /etc/ssl/cloudflare/hammerload-origin.csr
```

In Cloudflare select HammerLoad's zone, SSL/TLS > Origin Server > Create
Certificate > use your own CSR. Paste the CSR. Store the issued certificate at
`/etc/ssl/cloudflare/hammerload-origin.pem`, mode 644. Do not regenerate its key.

```bash
sudo curl -fsSL https://developers.cloudflare.com/ssl/static/origin_ca_rsa_root.pem \
  -o /etc/ssl/cloudflare/origin-ca.pem
sudo openssl pkey -in /etc/ssl/cloudflare/hammerload-origin.key -check -noout
for host in hammerload.com www.hammerload.com; do
  openssl verify -CAfile /etc/ssl/cloudflare/origin-ca.pem \
    -verify_hostname "$host" /etc/ssl/cloudflare/hammerload-origin.pem
done
```

Also compare certificate/key public-key SHA256 hashes using `set -o pipefail`
so a failed key reader cannot appear to pass by hashing empty output.
Copy the reviewed Nginx template to the new instance, then:

```bash
sudo install -m 644 ~/nginx-hammerload.conf /etc/nginx/sites-available/hammerload
sudo ln -sfn /etc/nginx/sites-available/hammerload /etc/nginx/sites-enabled/hammerload
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
curl --cacert /etc/ssl/cloudflare/origin-ca.pem \
  --resolve hammerload.com:443:127.0.0.1 -I https://hammerload.com/
curl --cacert /etc/ssl/cloudflare/origin-ca.pem \
  --resolve hammerload.com:443:127.0.0.1 https://hammerload.com/health
```

Origin CA is trusted by Cloudflare, not ordinary browser trust stores. Keep
Cloudflare proxy ON. For direct public-browser HTTPS use a publicly trusted
certificate instead. Test pages/assets on desktop/mobile and booking validation;
do not send real booking emails without approval.

## 6. Approved DNS cutover and observation

1. Privately back up old HammerLoad app/config and retain its running container.
2. Verify new HTTPS, pages/assets, booking validation, PM2 startup and deployment.
3. Set HammerLoad SSL to Full (strict) once BOTH origins support it.
4. With approval change ONLY HammerLoad apex/www web records to its new Static
   IP, retaining proxy ON. Check old-origin AAAA records too; preserve MX/TXT.
5. Verify actual public traffic reaches the new server, then observe stability.
6. Do NOT stop/delete DigitalOcean here. It also holds BioReza backups/other
   resources; cleanup requires a separate approved step.

Once live requests have side effects, investigate before reversing DNS: doing
so blindly may lose requests or send emails twice.

## Operations

```bash
sudo -u hammerload -H pm2 status
sudo -u hammerload -H pm2 logs hammerload --lines 30 --nostream
sudo -u hammerload -H env APP_DIR=/var/www/hammerload \
  bash /var/www/hammerload/releases/<OLDER_RELEASE>/deploy/activate-release.sh <OLDER_RELEASE>
```

Manual activation uses the deployment lock too. Pruning always protects the
active release and its immediate predecessor, even after manual rollback.
Monitor CPU/RAM/disk/restarts. PM2's 300 MB restart threshold is not an OS memory
limit. Logs may contain booking contact details: restrict access and do not
copy raw logs into public issues.
