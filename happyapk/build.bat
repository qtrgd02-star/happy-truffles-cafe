@echo off
REM Build script for Happy Truffles Cafe APK

echo Building Happy Truffles Cafe APK...

REM Step 1: Build Next.js app
echo Building Next.js app...
call npm run build

REM Step 2: Create dist folder for Capacitor
echo Preparing web assets...
if exist happyapk\dist rmdir /s /q happyapk\dist
mkdir happyapk\dist

REM Copy Next.js output to Capacitor web assets
xcopy /E /I .next\static happyapk\dist\static
xcopy /E /I public happyapk\dist\public
copy package.json happyapk\dist\

REM Create index.html for Capacitor
echo ^<!DOCTYPE html^>^<html lang="en"^>^<head^>^<meta charset="utf-8" /^>^<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" /^>^<meta name="theme-color" content="#8B4513" /^>^<meta name="description" content="Happy Truffles Cafe" /^>^<meta name="apple-mobile-web-app-capable" content="yes" /^>^<link rel="manifest" href="/manifest.json" /^>^<title^>Happy Truffles Cafe^</title^>^<style^>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif}#loading{position:fixed;top:0;left:0;right:0;bottom:0;background:#8B4513;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;z-index:9999}^</style^>^</head^>^<body^>^<div id="loading"^>Loading Happy Truffles Cafe...^</div^>^<script^>window.addEventListener('load',function(){document.getElementById('loading').style.display='none'});^</script^>^</body^>^</html^> > happyapk\dist\index.html

REM Step 3: Sync with Capacitor
echo Syncing with Capacitor...
cd happyapk
call npx cap sync android

echo Build complete!
echo To open in Android Studio: cd happyapk ^& npx cap open android
echo To build APK: cd happyapk\android ^& gradlew assembleDebug
pause