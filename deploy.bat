@echo off
echo ========================================
echo Nitesh Handicraft Deployment Script
echo ========================================
echo.
echo This script will help you deploy to GitHub and Render
echo.
echo Step 1: GitHub Setup
echo --------------------
echo 1. Go to: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Give it repo permissions
echo 4. Copy the token
echo.
echo Step 2: Configure Git
echo ---------------------
echo Replace YOUR_TOKEN with the actual token you copied
echo.
echo Step 3: Push to GitHub
echo ----------------------
echo Run: git push origin master
echo.
echo Step 4: Render Deployment
echo -------------------------
echo 1. Go to: https://render.com
echo 2. Sign up with GitHub
echo 3. Create new Web Service
echo 4. Connect to your repo
echo 5. Configure as per render.yaml
echo.
echo Press any key to continue...
pause >nul
