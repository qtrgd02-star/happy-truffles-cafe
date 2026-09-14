# Happy Truffles Cafe - Android APK Build

This folder contains the Capacitor configuration for building the Happy Truffles Cafe website as an Android APK.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Java JDK 17** - [Download here](https://adoptium.net/)
4. **Android Studio** - [Download here](https://developer.android.com/studio)
5. **Android SDK** (installed via Android Studio)

## Setup Instructions

### 1. Install Dependencies
```bash
cd happyapk
npm install
```

### 2. Build Web Assets
```bash
npm run build
```
This will:
- Build the Next.js app
- Export static files to `dist/` folder
- Prepare web assets for Capacitor

### 3. Add Android Platform
```bash
npm run sync
```
This will:
- Create Android project in `android/` folder
- Copy web assets to Android project
- Install required plugins

### 4. Open in Android Studio
```bash
npm run open
```
Or manually:
```bash
npx cap open android
```

### 5. Build APK

**Debug APK:**
```bash
cd android
./gradlew assembleDebug
# OR on Windows:
gradlew.bat assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

**Release APK:**
```bash
cd android
./gradlew assembleRelease
# OR on Windows:
gradlew.bat assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## Configuration

### App ID
- Current: `com.happytruffles.cafe`
- Change in `capacitor.config.ts`

### App Name
- Current: `Happy Truffles Cafe`
- Change in `capacitor.config.ts`

### Server URL
- Development: `http://localhost:3000`
- Production: Update `capacitor.config.ts` server URL

## Plugins Included

- **Push Notifications** - Receive order notifications
- **Local Notifications** - In-app notifications
- **Network** - Check internet connectivity
- **Geolocation** - Customer location for delivery
- **Camera** - Take photos for reviews

## Customization

### App Icon
Replace these files with your own icons (512x512px):
- `public/icon-192.png` - 192x192px
- `public/icon-512.png` - 512x512px
- `public/favicon.ico` - 32x32px

### Splash Screen
Create splash screens in `public/`:
- `splash-512x512.png` - 512x512px

### App Name
Update in `capacitor.config.ts`:
```typescript
appName: 'Happy Truffles Cafe'
```

## Troubleshooting

### Gradle Build Fails
- Ensure Java JDK 17 is installed
- Set `JAVA_HOME` environment variable
- Update Android SDK

### App Crashes on Startup
- Check `capacitor.config.ts` server URL
- Ensure web assets are built correctly
- Check Android Studio Logcat for errors

### Network Requests Fail
- Update `allowNavigation` in `capacitor.config.ts`
- Add your domain to the whitelist
- Enable `allowMixedContent` if using HTTP

## Publishing to Play Store

1. Generate signed APK/AAB:
   - In Android Studio: Build > Generate Signed Bundle / APK
   - Follow the signing wizard

2. Create Play Store listing:
   - App name, description, screenshots
   - Upload APK/AAB
   - Set pricing and distribution

3. Submit for review:
   - Google Play Console
   - Wait for approval (1-3 days)

## Support

For issues:
- Email: info@happytruffles.qa
- Phone: +974 3159 0002

## License

Private - Happy Truffles Cafe