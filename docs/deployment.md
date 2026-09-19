# Deployment Guide

## Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - NEXT_PUBLIC_BASE_URL
   - NEXT_PUBLIC_WHATSAPP_NUMBER
4. Deploy

## Netlify

1. Push code to GitHub
2. Import project in Netlify
3. Build command: npm run build
4. Publish directory: .next
5. Add environment variables
6. Deploy

## Docker

1. Build image:
   docker build -t happytruffles .

2. Run container:
   docker run -p 3000:3000 happytruffles

## Environment Variables

Required:
- NEXT_PUBLIC_BASE_URL: Your domain URL

Firebase (Required):
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

Firebase (Optional):
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
- NEXT_PUBLIC_FIREBASE_DATABASE_URL
- NEXT_PUBLIC_FIREBASE_VAPID_KEY

## Performance

- Images optimized via Next.js Image component
- Static pages pre-rendered
- API routes cached where appropriate
- Compression enabled

## Security

- Security headers configured
- Input validation on all API routes
- XSS protection enabled
- CSRF protection via same-origin policy