#!/bin/bash

# Automated APK Build Script
set -e

echo "========================================="
echo "Happy Truffles Cafe - APK Builder"
echo "========================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed"
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo "WARNING: Java not found. Please install JDK 17"
fi

echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo ""

# Install dependencies
echo "Installing dependencies..."
cd happyapk
npm install
echo ""

# Build web assets
echo "Building web assets..."
npm run build
echo ""

# Sync with Capacitor
echo "Syncing with Capacitor..."
npm run sync
echo ""

# Build APK
echo "Building APK..."
cd android
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    ./gradlew assembleDebug
else
    ./gradlew.bat assembleDebug
fi
echo ""

echo "========================================="
echo "BUILD COMPLETE!"
echo "========================================="
echo ""
echo "APK Location: android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "To install on device:"
echo "  adb install android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "To open in Android Studio:"
echo "  cd happyapk && npx cap open android"