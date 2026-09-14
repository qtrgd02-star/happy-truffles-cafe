#!/bin/bash

# Build script for Happy Truffles Cafe APK

echo "Building Happy Truffles Cafe APK..."

# Step 1: Build Next.js app
echo "Building Next.js app..."
npm run build

# Step 2: Create dist folder for Capacitor
echo "Preparing web assets..."
rm -rf happyapk/dist
mkdir -p happyapk/dist

# Copy Next.js output to Capacitor web assets
cp -r .next/static happyapk/dist/
cp -r public happyapk/dist/
cp package.json happyapk/dist/

# Create index.html for Capacitor
cat > happyapk/dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
  <meta name="theme-color" content="#8B4513" />
  <meta name="description" content="Happy Truffles Cafe - Artisan Chocolate & Coffee | Doha, Qatar" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Happy Truffles" />
  <link rel="apple-touch-icon" href="/icon-192.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
  <link rel="manifest" href="/manifest.json" />
  <title>Happy Truffles Cafe</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    #loading {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: #8B4513;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
      z-index: 9999;
    }
  </style>
</head>
<body>
  <div id="loading">Loading Happy Truffles Cafe...</div>
  <script>
    window.addEventListener('load', function() {
      document.getElementById('loading').style.display = 'none';
    });
  </script>
</body>
</html>
EOF

# Step 3: Sync with Capacitor
echo "Syncing with Capacitor..."
cd happyapk
npx cap sync android

echo "Build complete!"
echo "To open in Android Studio: cd happyapk && npx cap open android"
echo "To build APK: cd happyapk/android && ./gradlew assembleDebug"