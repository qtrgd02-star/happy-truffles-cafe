# Happy Truffles Cafe Website

Artisan chocolate truffles, specialty coffee, matcha, and cozy vibes in Doha, Qatar.

## Features

- Online ordering with cart and checkout
- WhatsApp order integration
- Delivery tracking
- Loyalty points program
- Table QR ordering
- Admin panel with analytics
- Menu filters and search
- Customer profiles
- Reviews and ratings
- Promo codes and gift cards
- Offline POS mode
- Email and SMS notifications
- Print receipts
- Multi-language support (English/Arabic)
- Dark mode
- Seasonal menus
- Corporate catering
- Staff scheduling
- Inventory management
- Waitlist management
- Referral program
- Birthday rewards
- Subscription orders
- Split billing
- Table reservations
- Virtual tour
- Blog

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Firebase / Local JSON fallback

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Start production server:
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=97431590002
```

## Project Structure

```
app/
  api/           - API routes
  admin/         - Admin panel pages
  components/    - Shared components
  lib/           - Utility functions
  ...            - Feature pages and contexts
public/          - Static assets
docs/            - Documentation
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

1. Build the project: `npm run build`
2. Start the server: `npm start`

## Documentation

- Admin guide: `docs/admin-guide.md`
- API docs: `docs/api.md`
- Deployment: `docs/deployment.md`
- Firebase setup: `FIREBASE_SETUP.md`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

Private - Happy Truffles Cafe
