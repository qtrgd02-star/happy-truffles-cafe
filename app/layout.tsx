import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "Happy Truffles Cafe | Artisan Chocolate & Coffee | Doha, Qatar",
    template: "%s | Happy Truffles Cafe"
  },
  description: "Experience artisan chocolate truffles, specialty coffee, matcha, and cozy vibes at Happy Truffles Cafe in C.T Plaza DA, South, CTA. Order online for delivery or dine-in.",
  keywords: ["happy truffles cafe", "chocolate truffles", "specialty coffee", "matcha", "ct plaza", "south cta", "qatar restaurant", "cafe doha", "artisan chocolate", "cafe near me", "best cafe in qatar", "truffles doha", "coffee shop qatar"],
  authors: [{ name: "Happy Truffles Cafe" }],
  creator: "Happy Truffles Cafe",
  publisher: "Happy Truffles Cafe",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://happy-truffles-cafe.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Happy Truffles Cafe | Artisan Chocolate & Coffee | Doha, Qatar",
    description: "Experience artisan chocolate truffles, specialty coffee, matcha, and cozy vibes at Happy Truffles Cafe in Doha, Qatar.",
    siteName: "Happy Truffles Cafe",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Happy Truffles Cafe - Artisan Chocolate and Coffee",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Truffles Cafe | Artisan Chocolate & Coffee | Doha, Qatar",
    description: "Experience artisan chocolate truffles, specialty coffee, matcha, and cozy vibes at Happy Truffles Cafe in Doha, Qatar.",
    images: ["/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: "Happy Truffles Cafe",
    description: "Artisan chocolate truffles, specialty coffee, matcha, and cozy vibes in Doha, Qatar.",
    url: "https://happy-truffles-cafe.vercel.app",
    image: "https://happy-truffles-cafe.vercel.app/hero.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "C.T Plaza DA, South, CTA",
      addressLocality: "Doha",
      addressCountry: "QA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 25.2854,
      longitude: 51.531,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
      opens: "07:00",
      closes: "23:30",
    },
    priceRange: "$$",
    servesCuisine: ["Coffee", "Desserts", "Chocolate", "Breakfast"],
    telephone: "+97400000000",
  };

  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#D4A574" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Happy Truffles" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${playfair.variable} ${jakarta.variable} font-jakarta antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
