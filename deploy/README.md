# Dolonia Cloud - Container Manager Deployment

This folder contains optimized Docker configuration for deploying Dolonia Cloud to NAS systems using Container Manager.

## Files Overview

- `Dockerfile` - Multi-stage Docker build with security hardening and health checks
- `nginx.conf` - Nginx configuration optimized for React SPA with favicon caching and security headers
- `build-for-container-manager.sh` - Linux/macOS build script
- `build-for-container-manager.bat` - Windows batch build script
- `build-for-container-manager.ps1` - Windows PowerShell build script

## Quick Start

### Windows (PowerShell - Recommended)

```powershell
.\deploy\build-for-container-manager.ps1
```

### Windows (Command Prompt)

```cmd
deploy\build-for-container-manager.bat
```

### Linux/macOS

```bash
chmod +x deploy/build-for-container-manager.sh
./deploy/build-for-container-manager.sh
```

## What the Build Script Does

1. **Validates Environment** - Checks for Docker and project structure
2. **Installs Dependencies** - Runs `npm ci` for clean installs
3. **Builds Production Bundle** - Creates optimized React build with `npm run build`
4. **Creates Docker Image** - Builds secure container with nginx
5. **Exports Image** - Saves as `deploy/dolonia-cloud.tar` for Container Manager

## Container Manager Deployment

After running the build script:

1. Open your NAS Container Manager
2. Navigate to **Image → Import**
3. Upload `deploy/dolonia-cloud.tar`
4. Create new container from `dolonia-cloud:latest`
5. Map container port `80` to NAS port (e.g., `8080`)
6. Access at `http://<your-nas-ip>:8080`

## Key Features

- ✅ **Security Hardened** - Non-root user, security headers, CSP
- ✅ **Performance Optimized** - Gzip compression, aggressive caching
- ✅ **Mobile Friendly** - Special favicon handling for iOS Safari
- ✅ **Health Monitoring** - Built-in health checks for Container Manager
- ✅ **SPA Routing** - Proper React Router support

## Troubleshooting

### Build Fails

- Ensure Docker Desktop is running
- Check that you're in the project root directory
- Verify `package.json` and `vite.config.ts` exist

### Container Won't Start

- Check Container Manager logs
- Verify port mapping (container:80 → NAS:8080)
- Ensure no other services are using the target port

### Favicon Issues

- Clear browser cache completely
- The container includes aggressive cache-busting for favicons
- iOS Safari may need a hard refresh (Cmd+Shift+R)

## Advanced Usage

### Skip Build (use existing dist/)

```powershell
.\deploy\build-for-container-manager.ps1 -SkipBuild
```

### Verbose Output

```powershell
.\deploy\build-for-container-manager.ps1 -Verbose
```

### Manual Docker Commands

```bash
# Build image
docker build -f deploy/Dockerfile -t dolonia-cloud:latest .

# Export for Container Manager
docker save dolonia-cloud:latest -o deploy/dolonia-cloud.tar

# Test locally
docker run -p 8080:80 dolonia-cloud:latest
```

## Security Notes

- Container runs as non-root `nginx` user
- Includes Content Security Policy headers
- XSS protection and frame options enabled
- No sensitive data exposed in image layers

## Performance Notes

- Static assets cached for 1 year
- Favicon files cached for 1 hour (mobile-friendly)
- Gzip compression for text-based content
- Multi-stage build minimizes image size
