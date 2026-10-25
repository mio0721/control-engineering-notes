@echo off
chcp 65001 >nul
cd /d "%~dp0"
python -c "import mistune, bs4, pygments" >nul 2>&1
if errorlevel 1 (
  echo First-time setup: installing Python dependencies...
  python -m pip install -r requirements.txt
  if errorlevel 1 (
    echo Failed to install dependencies.
    pause
    exit /b 1
  )
)
python build.py
if errorlevel 1 (
  echo Build failed; please review the error above.
  pause
  exit /b 1
)
echo Build complete. Open index.html in your browser.
pause
