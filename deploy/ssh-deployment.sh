# Complete SSH-based Docker Deployment for Dolonia Cloud

# 1. SSH into your NAS
ssh your-username@your-nas-ip

# 2. Create project directory
mkdir -p /volume1/docker/dolonia-cloud
cd /volume1/docker/dolonia-cloud

# 3. Clone your repository (if using Git)
git clone https://github.com/Dolonia333/dolonia-digital-ocean.git .

# Or if you have the files locally, use SCP to upload:
# scp -r /path/to/local/project/* your-username@your-nas-ip:/volume1/docker/dolonia-cloud/

# 4. Verify Docker is installed
docker --version
docker-compose --version

# 5. Build and run the container
docker-compose up -d --build

# 6. Check if it's running
docker-compose ps

# 7. View logs
docker-compose logs -f

# 8. Test the application
curl -I http://localhost:8080

# Access from browser: http://your-nas-ip:8080