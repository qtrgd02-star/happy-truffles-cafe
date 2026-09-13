import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { CartProvider } from "./cart-context";
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
  title: "Happy Truffles Cafe | Doha, Qatar",
  description:
    "Experience artisan chocolate truffles, specialty coffee, matcha, and cozy vibes at Happy Truffles Cafe in Gold Plaza, Abu Hamour, Doha, Qatar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${jakarta.variable} font-jakarta antialiased`}>
        <ThemeProvider>
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
                                        {children}
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
        </ThemeProvider>
      </body>
    </html>
  );
}
