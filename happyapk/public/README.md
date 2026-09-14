# App Icons and Splash Screens

Place your app icons in this folder with the following specifications:

## Required Icons

### Android
- `icon-192.png` - 192x192px (48dp mdpi)
- `icon-512.png` - 512x512px (128dp xxxhdpi)
- `fcm-icon.png` - 192x192px (Firebase push notifications)

### iOS
- `icon-1024.png` - 1024x1024px (App Store)
- `icon-180.png` - 180x180px (iPhone 60pt @3x)
- `icon-167.png` - 167x167px (iPad Pro 83.5pt @2x)
- `icon-152.png` - 152x152px (iPad 76pt @2x)
- `icon-120.png` - 120x120px (iPhone 60pt @2x)
- `icon-87.png` - 87x87px (iPhone 29pt @3x)
- `icon-80.png` - 80x80px (iPhone 40pt @2x)
- `icon-76.png` - 76x76px (iPad 76pt @1x)
- `icon-60.png` - 60x60px (iPhone 20pt @3x)
- `icon-40.png` - 40x40px (iPhone 20pt @2x)

## Splash Screens

### Android
- `splash-512x512.png` - 512x512px
- `splash-640x1136.png` - 640x1136px (iPhone 5)
- `splash-750x1334.png` - 750x1334px (iPhone 6/7/8)
- `splash-1242x2208.png` - 1242x2208px (iPhone 6/7/8 Plus)
- `splash-1125x2436.png` - 1125x2436px (iPhone X)
- `splash-828x1792.png` - 828x1792px (iPhone XR)
- `splash-1242x2688.png` - 1242x2688px (iPhone XS Max)

## Design Guidelines

- Use transparent PNG for icons
- Splash screens should have solid background color (#8B4513)
- Keep icons simple and recognizable
- Test on different screen sizes

## Quick Generation

Use online tools:
- https://appicon.co/
- https://www.pwabuilder.com/imageGenerator
- https://icon.kitchen/

Or use ImageMagick:
```bash
convert icon-1024.png -resize 192x192 icon-192.png
convert icon-1024.png -resize 512x512 icon-512.png
```