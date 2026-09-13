@echo off
chcp 65001 >nul
echo ==========================================
echo   Talabat Menu Sync Tool
echo ==========================================
echo.

set "SCRIPT_DIR=%~dp0"
set "TALABAT_WEB_FOLDER=%SCRIPT_DIR%Talabat Web"
set "EXTRACT_SCRIPT=%SCRIPT_DIR%scripts\extract-talabat-menu.js"
set "COMPARE_SCRIPT=%SCRIPT_DIR%scripts\compare-menu.js"
set "UPDATE_SCRIPT=%SCRIPT_DIR%scripts\add-missing-talabat-items.js"
set "TALABAT_JSON=%SCRIPT_DIR%scripts\talabat-menu.json"
set "REPORT=%SCRIPT_DIR%scripts\menu-comparison-report.md"

echo [1/4] Looking for Talabat HTML file...
echo.

if not exist "%TALABAT_WEB_FOLDER%" (
    echo ERROR: "Talabat Web" folder not found at: %TALABAT_WEB_FOLDER%
    pause
    exit /b 1
)

dir /b "%TALABAT_WEB_FOLDER%\*.html" >nul 2>&1
if errorlevel 1 (
    echo ERROR: No HTML file found in "Talabat Web" folder.
    echo Please save the Talabat page as HTML in: %TALABAT_WEB_FOLDER%
    pause
    exit /b 1
)

for /f "delims=" %%f in ('dir /b "%TALABAT_WEB_FOLDER%\*.html"') do (
    set "TALABAT_HTML=%TALABAT_WEB_FOLDER%\%%f"
    goto :found
)

:found
echo Found: %TALABAT_HTML%
echo.

echo [2/4] Extracting menu from Talabat HTML...
node "%EXTRACT_SCRIPT%" "%TALABAT_HTML%"
if errorlevel 1 (
    echo.
    echo ERROR: Extraction failed.
    pause
    exit /b 1
)
echo.

echo [3/4] Comparing with website menu...
node "%COMPARE_SCRIPT%" "%TALABAT_JSON%"
if errorlevel 1 (
    echo.
    echo ERROR: Comparison failed.
    pause
    exit /b 1
)
echo.

echo [4/4] Updating website menu...
node "%UPDATE_SCRIPT%"
if errorlevel 1 (
    echo.
    echo ERROR: Update failed.
    pause
    exit /b 1
)
echo.

echo ==========================================
echo   Sync Complete!
echo ==========================================
echo.
echo Report saved to: %REPORT%
echo.
echo Would you like to open the report now?
set /p OPEN_REPORT="Open report? (Y/N): "
if /i "%OPEN_REPORT%"=="Y" (
    if exist "%REPORT%" (
        start "" "%REPORT%"
    ) else (
        echo Report file not found: %REPORT%
    )
)
echo.
echo Press any key to exit...
pause >nul
