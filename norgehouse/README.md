# Norge House — Website Rebuild

Modern, multilingual website for **Norge House SIA** — a Latvian timber-frame prefab house manufacturer based in Cēsis, Latvia.

**Stack:** Next.js 14 + Payload CMS v3 + PostgreSQL + Docker

**Locales:** EN | LV | DE | IT

---

## Local Development

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

### Quick Start

```bash
# 1. Clone and install
git clone https://github.com/YOUR_ORG/norgehouse.git
cd norgehouse
pnpm install

# 2. Set up environment variables
cp apps/cms/.env.example apps/cms/.env
cp apps/web/.env.example apps/web/.env
# Edit .env files with your values

# 3. Start database + services with Docker
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d postgres

# 4. Start CMS and Web in dev mode
pnpm dev

# CMS admin: http://localhost:3001/admin
# Website:   http://localhost:3000
```

### Docker Development (full stack)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

---

## Project Structure

```
norgehouse/
├── apps/
│   ├── web/          # Next.js 14 frontend
│   └── cms/          # Payload CMS v3
├── packages/
│   └── types/        # Shared TypeScript types
├── docker/
│   └── nginx/        # Reverse proxy config
├── scripts/          # Deploy + migration scripts
└── docker-compose.yml
```

---

## First Deploy to DigitalOcean

### 1. Create Droplet

- Ubuntu 22.04 LTS, 2vCPU / 4GB RAM ($24/month)
- Choose Amsterdam or Frankfurt datacenter (closest to Latvia)

### 2. Install Docker

```bash
ssh root@YOUR_DROPLET_IP
curl -fsSL https://get.docker.com | sh
```

### 3. Clone & Configure

```bash
git clone https://github.com/YOUR_ORG/norgehouse /var/www/norgehouse
cd /var/www/norgehouse
cp apps/cms/.env.example apps/cms/.env
cp apps/web/.env.example apps/web/.env
# Edit .env files — set strong POSTGRES_PASSWORD, PAYLOAD_SECRET, etc.
```

### 4. DNS

Point `norgehouse.com` A record to your Droplet IP.

### 5. First Boot (HTTP only)

```bash
docker compose up -d postgres cms web nginx
```

### 6. Issue SSL Certificate

```bash
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d norgehouse.com -d www.norgehouse.com
```

Then enable the HTTPS server block in `docker/nginx/nginx.conf` and restart:

```bash
docker compose restart nginx
```

### 7. Seed CMS

```bash
docker compose exec cms pnpm payload seed
```

Save the admin password printed to the console.

### 8. Start Creating Content

Log into `https://norgehouse.com/admin` with the seeded admin credentials.

### 9. Migrate Images (Optional)

```bash
# Set PAYLOAD_TOKEN in your environment first
docker compose exec cms npx tsx /scripts/migrate-images.ts
```

### 10. SSL Auto-Renewal (Cron)

```bash
crontab -e
# Add:
0 0 * * * docker compose -f /var/www/norgehouse/docker-compose.yml run --rm certbot renew && docker compose -f /var/www/norgehouse/docker-compose.yml restart nginx
```

---

## CI/CD

Push to `main` branch triggers GitHub Actions:

1. SSH into Droplet
2. `git pull origin main`
3. `docker compose up --build -d`
4. Health check

**Required GitHub Secrets:**
- `DO_SSH_KEY` — SSH private key
- `DO_DROPLET_IP` — Droplet IP address

---

## URL Preservation

The site uses locale-prefixed URLs that match the existing WordPress site structure. Redirects in `next.config.js` handle root paths, and `@payloadcms/plugin-redirects` allows editors to add custom redirects from the CMS admin panel without code deployments.

### Existing URL structure preserved:
- `/en/home/`, `/lv/sakums/`, `/de/home/`, `/it/home/`
- `/en/about-us/`, `/lv/par-mums/`, `/de/uberuns/`, `/it/chi-siamo/`
- `/en/projects/`, `/lv/projekti/`, `/de/projekte/`, `/it/progetti/`
- `/en/news/`, `/lv/jaunumi/`, `/de/neuigkeiten/`, `/it/notizie/`
- All sub-pages with their locale-specific slugs

---

## Environment Variables

### CMS (`apps/cms/.env`)
| Variable | Description |
|----------|-------------|
| `DATABASE_URI` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | 32+ character random string |
| `NEXT_PUBLIC_SERVER_URL` | Public URL of the CMS |

### Web (`apps/web/.env`)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_PAYLOAD_URL` | Internal URL to Payload CMS API |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |
| `RESEND_API_KEY` | Resend.com API key for contact forms |
| `RESEND_FROM_EMAIL` | Sender email address |
| `RESEND_TO_EMAIL` | Recipient for contact form submissions |
