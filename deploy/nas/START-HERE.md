# 🚀 Quick NAS Deployment Guide

## ✅ What's in This Folder

This folder contains **EVERYTHING** you need to deploy to your Synology NAS:

```
DEPLOY-TO-NAS/
├── src/                ← Your React app source code
├── public/             ← Static assets
├── package.json        ← Dependencies
├── package-lock.json   ← Locked versions
├── index.html          ← App entry point
├── vite.config.ts      ← Build configuration
├── tsconfig.json       ← TypeScript config
├── docker-compose.yml  ← Main deployment file
├── .env                ← Your Supabase credentials (ALREADY CONFIGURED)
├── Dockerfile          ← Container build instructions
├── nginx.conf          ← Web server config
├── .dockerignore       ← Optimizes build size
└── START-HERE.md       ← This file
```

**This is a COMPLETE app package** - ready to build on your NAS!

---

## 🎯 Deploy to Synology NAS (3 Steps)

### Step 1: Upload This Entire Folder

1. Open **File Station** on your Synology
2. Navigate to: `/volume1/docker/dolonia.cloud/`
3. **Upload ALL files from this DEPLOY-TO-NAS folder**
   - `docker-compose.yml`
   - `.env` ← **IMPORTANT: This fixes your error!**
   - `Dockerfile`
   - `nginx.conf`
   - `.dockerignore`

### Step 2: Open Container Manager

1. Open **Container Manager** app on Synology
2. Go to **Project** tab
3. Click **Create**
4. Set path: `/volume1/docker/dolonia.cloud`
5. It will auto-detect `docker-compose.yml`
6. Click **Next** → **Done**

### Step 3: Wait for Build

The build will take 3-5 minutes. You'll see:

```
✓ Successfully built...
✓ Container started
```

Then access your app at:

```
http://10.15.20.201:8080
```

---

## ⚠️ Fixing Your Previous Error

Your error was:

```
Failed to load /volume1/docker/dolonia.cloud/.env: no such file or directory
```

**Why it happened:**

- `docker-compose.yml` requires a `.env` file
- You only had `.env.production` or `.env.template`

**Fixed by:**

- ✅ This folder now includes `.env` with your Supabase credentials
- ✅ Just upload this `.env` file to your NAS

---

## 🔧 Alternative: SSH Method (Advanced)

If you prefer SSH:

```bash
# 1. SSH into your NAS
ssh admin@10.15.20.201

# 2. Go to docker folder
cd /volume1/docker/dolonia.cloud

# 3. Verify .env exists
ls -la .env

# 4. Build and start
docker compose up -d --build

# 5. Check status
docker compose ps

# 6. View logs
docker compose logs -f
```

---

## ✅ What Happens During Build

1. **Install dependencies** (npm install) → 2-3 min
2. **Build React app** (npm run build) → 1-2 min
3. **Create Nginx container** → 30 sec
4. **Start container** on port 8080

Total time: ~3-5 minutes

---

## 🌐 Access Your App

After successful deployment:

**Local Network:**

```
http://10.15.20.201:8080
```

**Cloudflare Tunnel (if configured):**

```
https://dolonia.cloud
```

---

## 📋 Checklist

Before deploying, make sure:

- ✅ All files from DEPLOY-TO-NAS folder are uploaded
- ✅ `.env` file is present in `/volume1/docker/dolonia.cloud/`
- ✅ Port 8080 is not used by another container
- ✅ Container Manager is installed on Synology

---

## 🆘 Troubleshooting

### Build fails with "cannot find .env"

- **Fix:** Make sure you uploaded the `.env` file from this folder

### Port 8080 already in use

- **Fix:** Edit `docker-compose.yml` and change `8080:80` to `8081:80`

### Container starts but can't access app

- **Fix:** Check firewall settings on Synology
- **Fix:** Verify container is running: `docker compose ps`

### Supabase connection errors

- **Fix:** Verify `.env` has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

---

## 🎉 You're Done!

Once deployed, your Dolonia app will:

- ✅ Run automatically when NAS boots
- ✅ Restart if it crashes
- ✅ Be accessible from any device on your network
- ✅ Serve your React app via Nginx

Enjoy! 🚀
