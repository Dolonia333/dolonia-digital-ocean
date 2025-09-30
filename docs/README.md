# Dolonia Cloud - Complete Deployment Package

## 🎯 Overview

Dolonia Cloud is a modern React-based cybersecurity platform featuring:
- **Dynamic Binary Rain Animation**: 6 optimized animation patterns with hardware acceleration
- **Professional UI**: Built with ShadCN components and responsive design
- **WordPress Integration**: Complete theme package for CMS deployment
- **Docker Containerization**: Production-ready container for NAS deployment
- **SSH Deployment**: Automated scripts for seamless remote deployment

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Deployment
```bash
# Automated SSH deployment
./deploy.sh your-nas-ip your-username

# Or use Windows batch
deploy.bat your-nas-ip your-username
```

## 📁 Project Structure

```
dolonia-digital-ocean/
├── src/                    # React application source
│   ├── components/         # Reusable UI components
│   │   ├── BinaryRain.tsx  # Optimized animation system
│   │   ├── LiveChat.tsx    # Interactive chat component
│   │   └── Navigation.tsx  # Responsive navigation
│   ├── App.tsx            # Main application component
│   └── index.css          # Global styles with animations
├── dolonia-cloud/         # WordPress theme package
│   ├── functions.php      # Theme functions and hooks
│   ├── front-page.php     # Homepage template
│   ├── header.php         # Header template
│   ├── footer.php         # Footer template
│   └── style.css          # Theme stylesheet
├── Dockerfile             # Multi-stage Docker build
├── docker-compose.yml     # Container orchestration
├── nginx.conf            # Production web server config
├── deploy.sh             # Linux/macOS deployment script
├── deploy.bat            # Windows deployment script
├── SSH_DEPLOYMENT_GUIDE.md # Comprehensive deployment guide
├── DOCKER_DEPLOYMENT.md  # Docker-specific documentation
└── public/               # Static assets
    └── health.html       # Health check endpoint
```

## 🎨 Features

### Binary Rain Animation System
- **6 Animation Patterns**: Matrix, Digital Rain, Binary Stream, Glitch, Pulse, and Morph
- **Performance Optimized**: Hardware acceleration, adaptive quality, FPS monitoring
- **Responsive**: Adapts to screen size and device capabilities
- **Configurable**: Pattern switching, speed control, opacity settings

### WordPress Theme
- **PHP 7.0+ Compatible**: Clean, error-free code
- **Customizer Ready**: Theme options and settings
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Proper meta tags and structure

### Docker Containerization
- **Multi-stage Build**: Optimized for production (Node.js → Nginx)
- **Security Headers**: XSS protection, content security policy
- **Gzip Compression**: Fast asset delivery
- **Health Monitoring**: Built-in health check endpoint

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (for containerization)
- SSH client (for deployment)

### Local Development
```bash
# Clone repository
git clone https://github.com/Dolonia333/dolonia-digital-ocean.git
cd dolonia-digital-ocean

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Testing
```bash
# Run tests
npm test

# Build and preview
npm run preview
```

## 🚢 Deployment Options

### 1. Automated SSH Deployment (Recommended)
```bash
# Linux/macOS
./deploy.sh 192.168.1.100 admin /volume1/docker/dolonia-cloud

# Windows
deploy.bat 192.168.1.100 admin /volume1/docker/dolonia-cloud
```

### 2. Manual Docker Deployment
```bash
# Build and run
docker-compose up -d --build

# Access at http://your-nas-ip:8080
```

### 3. WordPress Theme Installation
1. Zip the `dolonia-cloud/` folder
2. Upload via WordPress Admin → Appearance → Themes → Add New
3. Activate the theme

## 📊 Monitoring & Health

### Health Check
- **URL**: http://your-deployment-url:8080/health
- **Status**: Real-time application health
- **Version**: Current deployment version
- **Timestamp**: Last health check time

### Container Monitoring
```bash
# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Resource usage
docker stats
```

## 🔒 Security Features

- **Content Security Policy**: Prevents XSS attacks
- **Security Headers**: X-Frame-Options, X-Content-Type-Options
- **Non-root Container**: Runs nginx as non-privileged user
- **Minimal Attack Surface**: Only necessary ports exposed

## 📈 Performance

- **Optimized Bundle**: Code splitting and tree shaking
- **Asset Caching**: 1-year cache headers for static files
- **Gzip Compression**: Automatic compression for text assets
- **Lazy Loading**: Components load on demand

## 🐛 Troubleshooting

### Common Issues

**Container won't start:**
```bash
docker-compose logs dolonia-app
docker-compose ps
```

**Health check fails:**
```bash
curl -I http://localhost:8080/health
docker-compose exec dolonia-app nginx -t
```

**Permission issues:**
```bash
sudo chown -R $USER:$USER /path/to/project
docker-compose down && docker-compose up -d --build
```

### Support
- Check `SSH_DEPLOYMENT_GUIDE.md` for detailed deployment help
- Review `DOCKER_DEPLOYMENT.md` for container-specific issues
- Verify NAS Docker installation and SSH access

## 📝 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Contact

For support or questions about Dolonia Cloud deployment, please refer to the documentation or contact the development team.
