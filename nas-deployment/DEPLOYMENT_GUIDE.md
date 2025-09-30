# Dolonia Cloud - Complete NAS Deployment Guide

## 📦 Deployment Options

### Option 1: Container Manager (Recommended)

**Files needed:** `dolonia-cloud.tar` only
**Size:** 24MB
**Best for:** Synology DSM users

### Option 2: Docker Compose

**Files needed:** `docker-compose.yml`, `Dockerfile`, `nginx.conf`
**Size:** ~5KB + source code
**Best for:** Manual Docker deployment

### Option 3: Direct File Serving

**Files needed:** `dist/` folder contents
**Size:** ~2MB
**Best for:** NAS with built-in web server

---

## 🚀 Container Manager Deployment (Recommended)

### Step 1: Upload Files

Upload `dolonia-cloud.tar` to your NAS using File Station

### Step 2: Import Image

1. Open **Container Manager** in DSM
2. Go to **"Image"** tab
3. Click **"Import"** → **"Import from file"**
4. Select `dolonia-cloud.tar`
5. Wait for import (shows as `dolonia-cloud:latest`)

### Step 3: Create Container

1. Go to **"Container"** tab
2. Click **"Create"** → **"Create container"**
3. Configure:
   - **Name:** `dolonia-cloud`
   - **Image:** `dolonia-cloud:latest`
   - **Port:** `8080` → `80` (TCP)
   - **Restart:** Always
4. Click **"Create"**

### Step 4: Access

- **URL:** `http://your-nas-ip:8080`
- **Status:** Check Container Manager for "Running" status

---

## 🔧 Alternative: Docker Compose

If Container Manager doesn't work:

### Upload Files

Upload these files to `/volume1/docker/dolonia-cloud/`:

- `docker-compose.yml`
- `Dockerfile`
- `nginx.conf`

### Deploy

```bash
ssh admin@your-nas-ip
cd /volume1/docker/dolonia-cloud
docker-compose up -d --build
```

---

## 📁 File Purposes

| File                 | Purpose                 | Container Manager | Docker Compose | Direct        |
| -------------------- | ----------------------- | ----------------- | -------------- | ------------- |
| `dolonia-cloud.tar`  | Pre-built Docker image  | ✅ Required       | ❌ Not needed  | ❌ Not needed |
| `docker-compose.yml` | Container orchestration | ❌ Not needed     | ✅ Required    | ❌ Not needed |
| `Dockerfile`         | Build instructions      | ❌ Not needed     | ✅ Required    | ❌ Not needed |
| `nginx.conf`         | Web server config       | ❌ Not needed     | ✅ Required    | ❌ Not needed |
| `dist/`              | Built application       | ❌ Not needed     | ❌ Not needed  | ✅ Required   |

---

## 🎯 Which Option to Choose?

### Choose **Container Manager** if:

- You use Synology DSM
- You prefer GUI management
- You want simplest deployment
- You have limited SSH experience

### Choose **Docker Compose** if:

- You prefer command-line
- Container Manager isn't available
- You need advanced configuration
- You're comfortable with SSH

### Choose **Direct File Serving** if:

- Docker isn't available on your NAS
- You have a built-in web server
- You want minimal resource usage

---

## ✅ What's Included in Your App

- 🌐 **Modern React Application** with TypeScript
- 🤖 **Enhanced Chatbot** with conversation context
- 📱 **Mobile-Optimized** navigation with swipe gestures
- 🌧️ **Binary Rain Animation** (slower on mobile)
- 🎨 **Responsive Design** for all screen sizes
- ⚡ **Production-Ready** nginx configuration

---

## 🔍 Troubleshooting

### Container Won't Start

- Check logs in Container Manager
- Verify port 8080 is available
- Ensure sufficient NAS resources

### Can't Access Application

- Verify container status is "Running"
- Check firewall settings in DSM
- Try different port if 8080 conflicts

### Performance Issues

- Monitor resource usage in Container Manager
- Consider adjusting container resource limits
- Check NAS system resources

---

## 📞 Support

If you encounter issues:

1. Check Container Manager logs
2. Verify file uploads completed
3. Test with different ports
4. Ensure NAS meets requirements

---

**Ready to deploy!** Choose your preferred method above. 🚀
