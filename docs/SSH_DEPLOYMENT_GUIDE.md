# Dolonia Cloud - Complete SSH Deployment Guide

## Prerequisites
- SSH access to your NAS
- Docker and Docker Compose installed on NAS
- Git (optional, for cloning repository)

## Method 1: Clone Repository (Recommended)

```bash
# SSH into your NAS
ssh your-username@your-nas-ip

# Navigate to a suitable directory (adjust path for your NAS)
cd /volume1/docker/  # Synology typical path
# or
cd /mnt/user/appdata/  # Unraid typical path
# or
cd /opt/docker/  # Generic Linux path

# Create project directory
mkdir dolonia-cloud
cd dolonia-cloud

# Clone the repository
git clone https://github.com/Dolonia333/dolonia-digital-ocean.git .

# If you need to switch to a specific branch
git checkout chore/pre-change-snapshot

# Build and start the container
docker-compose up -d --build
```

## Method 2: Upload Files via SCP

If you can't use Git, upload files from your local machine:

```bash
# From your local machine (Windows PowerShell)
scp -r C:\Users\zionv\OneDrive\Desktop\dolonia-digital-ocean\* your-username@your-nas-ip:/volume1/docker/dolonia-cloud/

# Or from Linux/Mac
scp -r /path/to/dolonia-digital-ocean/* your-username@your-nas-ip:/volume1/docker/dolonia-cloud/
```

Then SSH in and run:
```bash
cd /volume1/docker/dolonia-cloud
docker-compose up -d --build
```

## Method 3: Manual File Transfer (if SCP doesn't work)

1. **Create project directory on NAS:**
```bash
ssh your-username@your-nas-ip
mkdir -p /volume1/docker/dolonia-cloud
```

2. **Upload files individually using your NAS web interface** (DSM File Station, etc.)

3. **SSH back in and build:**
```bash
cd /volume1/docker/dolonia-cloud
docker-compose up -d --build
```

## Verification Commands

```bash
# Check if container is running
docker-compose ps

# View container logs
docker-compose logs -f dolonia-app

# Check container health
docker-compose exec dolonia-app nginx -t

# Test HTTP response
curl -I http://localhost:8080

# Check resource usage
docker stats
```

## Access Your Application

- **From NAS locally:** http://localhost:8080
- **From network:** http://your-nas-ip:8080
- **From domain:** http://dolonia.cloud:8080 (if DNS configured)

## Update Procedure

```bash
# Pull latest changes
cd /volume1/docker/dolonia-cloud
git pull

# Rebuild and restart
docker-compose up -d --build

# Clean up old images (optional)
docker image prune -f
```

## Troubleshooting

### Container Won't Start
```bash
# Check detailed logs
docker-compose logs dolonia-app

# Check Docker system resources
docker system df

# Restart Docker service (if needed)
sudo systemctl restart docker  # Linux
# or for Synology: Check Docker package in Package Center
```

### Port Already in Use
```bash
# Check what's using port 8080
netstat -tlnp | grep :8080
lsof -i :8080

# Change port in docker-compose.yml
# ports:
#   - "8081:80"
```

### Permission Issues
```bash
# Check directory permissions
ls -la /volume1/docker/dolonia-cloud

# Fix permissions if needed
sudo chown -R your-username:users /volume1/docker/dolonia-cloud
```

### Build Issues
```bash
# Clear Docker cache
docker system prune -f

# Rebuild without cache
docker-compose build --no-cache

# Check available disk space
df -h
```

## NAS-Specific Notes

### Synology DSM
- Docker is available in Package Center
- Use `/volume1/docker/` for persistent storage
- Enable SSH in Control Panel → Terminal & SNMP
- Web interface: http://your-nas-ip:5000 (Docker UI)

### QNAP
- Docker available in App Center
- Use `/share/Container/` or `/share/Docker/`
- SSH enabled in Control Panel → Network & Services

### Unraid
- Docker built-in
- Use `/mnt/user/appdata/`
- Web UI accessible directly

## Security Considerations

```bash
# Run security scan on container
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock docker/docker-bench-security

# Check for vulnerabilities
docker scan dolonia-cloud
```

## Backup Strategy

```bash
# Backup container and data
docker-compose down
tar -czf dolonia-cloud-backup-$(date +%Y%m%d).tar.gz /volume1/docker/dolonia-cloud

# Restore
tar -xzf dolonia-cloud-backup-20231201.tar.gz -C /volume1/docker/
docker-compose up -d
```

## Monitoring

```bash
# Set up log rotation
docker-compose logs --tail=100 -f dolonia-app

# Monitor resource usage
docker stats dolonia-app

# Health check
docker-compose exec dolonia-app curl -f http://localhost/health || echo "Unhealthy"
```