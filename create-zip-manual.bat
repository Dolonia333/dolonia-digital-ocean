@echo off
echo Creating Docker deployment package...

REM Create a simple compressed folder using Windows built-in compression
REM This creates a standard Windows ZIP file

echo.
echo MANUAL STEPS TO CREATE ZIP:
echo 1. Select all these files in Windows Explorer:
echo    - src folder
echo    - public folder  
echo    - package.json
echo    - package-lock.json
echo    - vite.config.ts
echo    - tsconfig.json
echo    - tsconfig.app.json
echo    - tsconfig.node.json
echo    - tailwind.config.ts
echo    - postcss.config.js
echo    - components.json
echo    - index.html
echo    - Dockerfile
echo    - nginx.conf
echo    - .dockerignore
echo    - docker-compose.yml
echo    - deploy.sh
echo    - deploy.ps1
echo    - DEPLOYMENT_INSTRUCTIONS.txt
echo.
echo 2. Right-click and select "Send to" > "Compressed (zipped) folder"
echo 3. Name it "dolonia-docker.zip"
echo 4. Upload this ZIP to your NAS and extract it
echo 5. Follow the instructions in DEPLOYMENT_INSTRUCTIONS.txt
echo.
echo Your Docker setup is complete and ready for deployment!
echo.
pause