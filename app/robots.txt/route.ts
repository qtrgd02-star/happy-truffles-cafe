import { MetadataRoute } from 'next';

export const metadata: MetadataRoute = {
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function GET() {
  return new Response(
    `User-agent: *
Allow: /

Disallow: /api/
Disallow: /admin/
Disallow: /_next/

Sitemap: https://happy-truffles-cafe.vercel.app/sitemap.xml`,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  );
}
