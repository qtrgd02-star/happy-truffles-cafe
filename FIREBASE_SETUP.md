# Firebase Setup for Happy Truffles Cafe

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `happy-truffles-cafe`
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Choose a location close to Qatar (e.g., `europe-west3` or `us-central1`)
5. Click "Enable"

## Step 3: Get Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (`</>`)
4. Register app name: `happy-truffles-web`
5. Copy the Firebase config object

## Step 4: Update Environment Variables

Open `.env.local` and replace the placeholder values with your actual Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=happy-truffles-cafe.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=happy-truffles-cafe
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=happy-truffles-cafe.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Step 5: Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init hosting
```

4. Select your project: `happy-truffles-cafe`

5. Set public directory: `.next`

6. Configure as single-page app: `No`

7. Set up automatic builds: `No` (we will use GitHub Actions or manual deploy)

8. Update `firebase.json`:
```json
{
  "hosting": {
    "target": "happy-truffles-cafe",
    "public": ".next",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

## Step 6: Build and Deploy

1. Build your Next.js app:
```bash
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy
```

## Step 7: Enable Firebase Auth (Optional)

If you want to use Firebase Auth instead of localStorage:

1. Go to Firebase Console > Authentication
2. Click "Get started"
3. Enable "Email/Password" sign-in method
4. Update `app/auth-context.tsx` to use Firebase Auth

## Firestore Collections

The following Firestore collections are used:

- `menuItems` - Menu items
- `settings` - Restaurant settings
- `orders` - Customer orders
- `reservations` - Table reservations
- `reviews` - Customer reviews

## Security Rules

Update Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /menuItems/{itemId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /settings/{docId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /orders/{orderId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /reservations/{reservationId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Next Steps

- Set up Firebase Auth for admin users
- Configure Firebase Storage for menu images
- Set up Cloud Functions for server-side operations
- Configure Firebase Analytics

## Support

For Firebase documentation, visit: https://firebase.google.com/docs
