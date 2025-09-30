# Dolonia Cloud - Docker Deployment

This guide will help you build and deploy the Dolonia Cloud React application as a Docker container on your NAS.

## Prerequisites

- Docker installed on your NAS
- Docker Compose (recommended)
- SSH access to your NAS

## Automated SSH Deployment

For easy deployment to your NAS via SSH, use the provided deployment scripts:

### Linux/macOS (deploy.sh)
```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh your-nas-ip your-username /volume1/docker/dolonia-cloud
```

### Windows (deploy.bat)
```batch
# Run deployment
deploy.bat your-nas-ip your-username /volume1/docker/dolonia-cloud
```

### What the scripts do:
1. **Prerequisites Check**: Verifies required tools and local project
2. **File Upload**: Securely uploads project files to NAS via SCP
3. **Remote Deployment**: Builds and starts Docker containers on NAS
4. **Health Verification**: Tests application health and provides access URLs

## Manual SSH Deployment

If you prefer manual control, follow these steps:

```bash
# 1. SSH into your NAS
ssh your-username@your-nas-ip

# 2. Create project directory
mkdir -p /volume1/docker/dolonia-cloud
cd /volume1/docker/dolonia-cloud

# 3. Upload files (from local machine)
scp -r /path/to/dolonia-digital-ocean/* your-username@your-nas-ip:/volume1/docker/dolonia-cloud/

# 4. Deploy on NAS
docker-compose up -d --build
```

## Health Monitoring

The application includes a health check endpoint for monitoring:

- **Health Check URL**: http://your-nas-ip:8080/health
- **Status Page**: Shows application status, version, and timestamp
- **Automated Checks**: Use in monitoring scripts or load balancers

### Health Check Script
```bash
#!/bin/bash
# Check if application is healthy
if curl -f http://localhost:8080/health >/dev/null 2>&1; then
    echo "✓ Application is healthy"
else
    echo "✗ Application is unhealthy"
fi
```

## Access Your Application

Once the container is running, access your application at:
- **Local:** http://your-nas-ip:8080
- **Network:** http://dolonia.cloud:8080 (if configured)

## Docker Commands Reference

### Build the Image
```bash
docker-compose build
# or
docker build -t dolonia-cloud .
```

### Start the Container
```bash
docker-compose up -d
# or
docker run -d -p 8080:80 --name dolonia-app dolonia-cloud
```

### Stop the Container
```bash
docker-compose down
# or
docker stop dolonia-app
```

### View Logs
```bash
docker-compose logs -f
# or
docker logs -f dolonia-app
```

### Update the Application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build
```

## Configuration

### Port Configuration
By default, the application runs on port 8080. To change this, modify the `docker-compose.yml`:

```yaml
ports:
  - "YOUR_PORT:80"
```

### Environment Variables
Add environment variables in `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - CUSTOM_VAR=value
```

## Troubleshooting

### Container Won't Start
```bash
# Check container status
docker ps -a

# View detailed logs
docker logs dolonia-app

# Check if port 8080 is available
netstat -tlnp | grep :8080
```

### Permission Issues
```bash
# Check Docker permissions
docker info

# Run as sudo if needed
sudo docker-compose up -d
```

### Build Issues
```bash
# Clear Docker cache
docker system prune -f

# Rebuild without cache
docker-compose build --no-cache
```

## File Structure

```
dolonia-digital-ocean/
├── Dockerfile              # Docker build instructions
├── docker-compose.yml      # Docker Compose configuration
├── nginx.conf             # Nginx web server config
├── .dockerignore          # Files to exclude from build
├── package.json           # Node.js dependencies
├── vite.config.ts         # Vite configuration
└── src/                   # React application source
```

## Security Notes

- The container runs nginx as a non-root user
- Security headers are configured in nginx.conf
- Consider using HTTPS in production
- Regularly update base images for security patches

## Performance

- Static assets are cached for 1 year
- Gzip compression is enabled
- Multi-stage build reduces final image size
- Health checks ensure container reliability