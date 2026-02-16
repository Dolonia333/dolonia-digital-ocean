# 🐳 Docker Hub Deployment Guide - DOLONIA DATA TECH

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- Docker Hub account (username: `doloniadatatech`)

### Step 1: Login to Docker Hub

```bash
docker login
```

Enter your Docker Hub credentials when prompted.

### Step 2: Run the Push Script

**Windows (PowerShell):**
```powershell
.\docker-push.ps1
```

**Linux/Mac/WSL (Bash):**
```bash
chmod +x docker-push.sh
./docker-push.sh
```

---

## What the Script Does

1. ✅ Verifies Docker is running
2. ✅ Checks Docker Hub authentication
3. ✅ Builds the image from `DEPLOY-TO-NAS/Dockerfile`
4. ✅ Tags with both `latest` and version number
5. ✅ Pushes both tags to Docker Hub
6. ✅ Provides pull and run commands

---

## Manual Deployment (Alternative)

If you prefer manual steps:

```bash
# 1. Navigate to deployment folder
cd DEPLOY-TO-NAS

# 2. Build the image
docker build -t doloniadatatech/dolonia-cloud:latest -t doloniadatatech/dolonia-cloud:1.0.0 .

# 3. Push to Docker Hub
docker push doloniadatatech/dolonia-cloud:latest
docker push doloniadatatech/dolonia-cloud:1.0.0
```

---

## Deploying on Your NAS

### Option 1: Direct Docker Run

```bash
# SSH into NAS
ssh admin@10.15.20.201

# Pull the image
docker pull doloniadatatech/dolonia-cloud:latest

# Run the container
docker run -d \
  --name dolonia-web \
  -p 8080:80 \
  -e VITE_SUPABASE_URL=https://supabase.dolonia.cloud \
  -e VITE_SUPABASE_ANON_KEY=your_actual_key_here \
  -e VITE_STRIPE_PUBLISHABLE_KEY=your_actual_key_here \
  --restart unless-stopped \
  doloniadatatech/dolonia-cloud:latest
```

### Option 2: Docker Compose (Recommended)

Create `docker-compose.yml` on your NAS:

```yaml
version: '3.8'

services:
  web:
    image: doloniadatatech/dolonia-cloud:latest
    container_name: dolonia-web
    ports:
      - "8080:80"
    environment:
      - VITE_SUPABASE_URL=https://supabase.dolonia.cloud
      - VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Create `.env` file with your secrets:

```bash
SUPABASE_ANON_KEY=your_actual_key_here
STRIPE_PUBLISHABLE_KEY=your_actual_key_here
```

Deploy:

```bash
docker-compose up -d
```

---

## Updating Deployment

### On Your NAS:

```bash
# Pull latest image
docker pull doloniadatatech/dolonia-cloud:latest

# Stop and remove old container
docker stop dolonia-web
docker rm dolonia-web

# Run new container (use same docker run command as above)
# Or if using docker-compose:
docker-compose pull
docker-compose up -d
```

---

## Image Details

**Repository:** `doloniadatatech/dolonia-cloud`
**Registry:** Docker Hub
**URL:** https://hub.docker.com/r/doloniadatatech/dolonia-cloud

**Tags:**
- `latest` - Always points to the most recent build
- `1.0.0` - Specific version (update VERSION in scripts for new releases)

**Architecture:** Multi-stage build
- **Stage 1:** Node.js 18 (build React app)
- **Stage 2:** Nginx Alpine (serve static files)

**Size:** ~50-100MB (optimized)

---

## Environment Variables

Required at runtime:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://supabase.dolonia.cloud` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe public key | `pk_...` |

**Note:** These are injected at **build time** during the Vite build process, but should be provided at **runtime** for flexibility.

---

## Automated Deployment (Future Enhancement)

### GitHub Actions Workflow

Create `.github/workflows/docker-publish.yml`:

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]
  release:
    types: [ published ]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: ./DEPLOY-TO-NAS
          push: true
          tags: |
            doloniadatatech/dolonia-cloud:latest
            doloniadatatech/dolonia-cloud:${{ github.sha }}
```

---

## Troubleshooting

### "docker login" fails
```bash
# Use access token instead of password
# Create at: https://hub.docker.com/settings/security
docker login -u doloniadatatech
```

### Build fails
```bash
# Check Docker is running
docker info

# Clean build cache
docker builder prune -a

# Check Dockerfile exists
ls DEPLOY-TO-NAS/Dockerfile
```

### Push fails
```bash
# Verify login
docker info | grep Username

# Check image exists
docker images | grep dolonia-cloud

# Retry with full registry path
docker push docker.io/doloniadatatech/dolonia-cloud:latest
```

### Container won't start on NAS
```bash
# Check logs
docker logs dolonia-web

# Check if port is in use
netstat -tulpn | grep 8080

# Verify image pulled correctly
docker images | grep dolonia-cloud
```

---

## Security Best Practices

1. ✅ **Never commit secrets** to Git or Docker image
2. ✅ **Use environment variables** for sensitive data
3. ✅ **Rotate Docker Hub tokens** regularly
4. ✅ **Use Docker secrets** in production (Docker Swarm/Kubernetes)
5. ✅ **Scan images** for vulnerabilities:
   ```bash
   docker scan doloniadatatech/dolonia-cloud:latest
   ```

---

## Next Steps

1. ✅ Push image to Docker Hub (run script above)
2. ✅ Verify on https://hub.docker.com/r/doloniadatatech/dolonia-cloud
3. ✅ Deploy to NAS using Docker Compose
4. ✅ Set up Watchtower for auto-updates (optional):
   ```yaml
   watchtower:
     image: containrrr/watchtower
     volumes:
       - /var/run/docker.sock:/var/run/docker.sock
     command: --interval 300 dolonia-web
   ```

---

## Support

**Issues?** Check:
- Docker Desktop is running
- Logged in to Docker Hub
- Internet connection is stable
- NAS has access to Docker Hub

**Questions?** Review:
- Docker documentation: https://docs.docker.com
- Docker Hub docs: https://docs.docker.com/docker-hub/
