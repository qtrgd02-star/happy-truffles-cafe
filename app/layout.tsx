import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { CartProvider } from "./cart-context";
import { CustomerProvider } from "./customer-context";
import { ToastProvider } from "./toast-context";
import { WishlistProvider } from "./wishlist-context";
import { RecentlyViewedProvider } from "./recently-viewed-context";
import { PromoProvider } from "./promo-context";
import { ThemeProvider } from "./theme-context";
import { OrderHistoryProvider } from "./order-history-context";
import { ReservationProvider } from "./reservation-context";
import { AuthProvider } from "./auth-context";
import { LoyaltyProvider } from "./loyalty-context";
import { GiftCardProvider } from "./gift-card-context";
import { LanguageProvider } from "./language-context";
import { TableProvider } from "./table-context";
import { ReviewsProvider } from "./reviews-context";
import { ShiftProvider } from "./shift-context";
import { StaffProvider } from "./staff-context";
import { InventoryProvider } from "./inventory-context";
import { OrderScheduleProvider } from "./order-schedule-context";
import { SplitBillingProvider } from "./split-billing-context";
import { WaitlistProvider } from "./waitlist-context";
import { ReferralProvider } from "./referral-context";
import { DriverProvider } from "./driver-context";
import { CateringProvider } from "./catering-context";
import { SeasonalMenuProvider } from "./seasonal-menu-context";
import { StaffScheduleProvider } from "./staff-schedule-context";
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
  keywords: ["happy truffles cafe", "chocolate truffles", "specialty coffee", "matcha", "ct plaza", "south cta", "qatar restaurant", "cafe doha", "artisan chocolate", "cafe near me"],
  authors: [{ name: "Happy Truffles Cafe" }],
  creator: "Happy Truffles Cafe",
  publisher: "Happy Truffles Cafe",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
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

import { ServiceWorkerRegistrar } from "./components/service-worker-registrar";
import { SubscriptionProvider } from "./subscription-context";
import { CustomizationProvider } from "./customization-context";
import { CorporateProvider } from "./corporate-context";
import { WhatsAppProvider } from "./whatsapp-context";
import { BirthdayProvider } from "./birthday-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${jakarta.variable} font-jakarta antialiased`}>
        <ThemeProvider>
          <CustomerProvider>
          <CartProvider>
            <ToastProvider>
              <WishlistProvider>
                <RecentlyViewedProvider>
                  <PromoProvider>
                    <OrderHistoryProvider>
                      <ReservationProvider>
                        <AuthProvider>
                          <LoyaltyProvider>
                            <GiftCardProvider>
                              <LanguageProvider>
                                <TableProvider>
                                  <ReviewsProvider>
                                    <ShiftProvider>
                                      <StaffProvider>
                                        <InventoryProvider>
                                          <OrderScheduleProvider>
                                            <SplitBillingProvider>
                                              <WaitlistProvider>
                                                <ReferralProvider>
                                                  <DriverProvider>
                                                    <CateringProvider>
                                                      <SeasonalMenuProvider>
                                                       <StaffScheduleProvider>
                                                         <ServiceWorkerRegistrar />
                                                         <SubscriptionProvider>
                                                           <CustomizationProvider>
                                                             <CorporateProvider>
                                                               <WhatsAppProvider>
                                                                 <BirthdayProvider>
                                                                   {children}
                                                                 </BirthdayProvider>
                                                               </WhatsAppProvider>
                                                             </CorporateProvider>
                                                           </CustomizationProvider>
                                                         </SubscriptionProvider>
                                                       </StaffScheduleProvider>
                                                    </SeasonalMenuProvider>
                                                    </CateringProvider>
                                                  </DriverProvider>
                                                </ReferralProvider>
                                              </WaitlistProvider>
                                            </SplitBillingProvider>
                                          </OrderScheduleProvider>
                                        </InventoryProvider>
                                      </StaffProvider>
                                    </ShiftProvider>
                                  </ReviewsProvider>
                                </TableProvider>
                              </LanguageProvider>
                            </GiftCardProvider>
                          </LoyaltyProvider>
                        </AuthProvider>
                      </ReservationProvider>
                    </OrderHistoryProvider>
                  </PromoProvider>
                </RecentlyViewedProvider>
              </WishlistProvider>
            </ToastProvider>
          </CartProvider>
          </CustomerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}



