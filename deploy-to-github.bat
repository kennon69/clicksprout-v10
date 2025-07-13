@echo off
echo ClickSprout v1.0 - GitHub Deployment Script
echo ==========================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: package.json not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

echo Checking git status...
git status

echo.
echo Current remotes:
git remote -v

echo.
set /p GITHUB_USERNAME="Enter your GitHub username (default: kennon69): "
if "%GITHUB_USERNAME%"=="" set GITHUB_USERNAME=kennon69

set REPO_URL=https://github.com/%GITHUB_USERNAME%/clicksprout-v1.git

echo.
echo Configured repository URL: %REPO_URL%
echo.

REM Check if remote already exists
git remote get-url origin >nul 2>&1
if %errorlevel% equ 0 (
    echo Remote 'origin' already exists. Updating...
    git remote set-url origin %REPO_URL%
) else (
    echo Adding remote 'origin'...
    git remote add origin %REPO_URL%
)

echo.
echo Checking for uncommitted changes...
git add .
git status

echo.
set /p COMMIT_MSG="Enter commit message (default: 'Initial commit - Production ready'): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Initial commit - Production ready

echo.
echo Committing changes...
git commit -m "%COMMIT_MSG%"

echo.
echo Pushing to GitHub...
echo IMPORTANT: Make sure you've created the repository '%GITHUB_USERNAME%/clicksprout-v1' on GitHub first!
echo.
pause

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Your code has been pushed to GitHub.
    echo.
    echo Next steps:
    echo 1. Go to https://vercel.com/new
    echo 2. Import your repository: %GITHUB_USERNAME%/clicksprout-v1
    echo 3. Configure environment variables
    echo 4. Deploy!
    echo.
    echo Repository URL: %REPO_URL%
) else (
    echo.
    echo ❌ Push failed. Please check:
    echo 1. Repository exists on GitHub
    echo 2. You have push permissions
    echo 3. Internet connection is working
    echo.
    echo You can try again manually with:
    echo git push -u origin main
)

echo.
pause
