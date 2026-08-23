# HammerLoad Docker Deployment

This project ships as one Docker service: Vite builds the static site into `dist`, and the Node server in `server/index.js` serves both `dist` and the booking API.

## Pick A Free Port

Check what is already running before choosing a host port:

```bash
docker ps
```

If another project already uses `4000`, choose a different host port when deploying:

```bash
HOST_PORT=4010 ./deploy.sh
```

`HOST_PORT` is the server port exposed to Nginx. The HammerLoad container listens on `PORT`, which defaults to `4000`; keep it unchanged unless you have a specific reason to change the internal container port too.

## Create `.env.production`

Create this file manually on the server in the project root. Do not commit it.

Required variables:

```env
RESEND_API_KEY=your_resend_api_key_here
BOOKING_ALLOWED_ORIGINS=https://hammerload.com,https://www.hammerload.com
```

Optional:

```env
VITE_API_URL=
```

The frontend uses the relative path `/api/send-booking`, so it works behind the production domain without hardcoded localhost URLs.

## Deploy

First deployment and later updates use the same script:

```bash
chmod +x deploy.sh
./deploy.sh
```

With a custom host port:

```bash
HOST_PORT=4010 ./deploy.sh
```

The script pulls `origin/main`, checks `.env.production`, builds the image, starts the service, shows container status, and prints the last 20 log lines.

## Domain And SSL

1. In Cloudflare, create an `A` record for `hammerload.com` pointing to the DigitalOcean server IP.
2. Create another `A` record for `www` pointing to the same IP.
3. Copy `nginx-hammerload.conf` to `/etc/nginx/sites-available/hammerload`.
4. Symlink it:

```bash
sudo ln -s /etc/nginx/sites-available/hammerload /etc/nginx/sites-enabled/hammerload
```

5. Issue SSL certificates with Certbot:

```bash
sudo certbot --nginx -d hammerload.com -d www.hammerload.com
```

6. Verify and reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```
