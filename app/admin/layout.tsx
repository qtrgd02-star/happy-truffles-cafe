"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, Menu as MenuIcon, Package, Calendar, Users as UsersIcon, MessageSquare, FileText, Package as PackageIcon, Tag, UserSquare, QrCode, Trophy, MapPin, BarChart3, Mail as MailIcon, Building2, MessageCircle, ShoppingCart, UtensilsCrossed } from "lucide-react";
import { InventoryProvider } from "@/app/inventory-context";
import { StaffProvider } from "@/app/staff-context";
import { AuthProvider } from "@/app/auth-context";
import { OrderHistoryProvider } from "@/app/order-history-context";
import { ShiftProvider } from "@/app/shift-context";
import { ReviewsProvider } from "@/app/reviews-context";
import { TableProvider } from "@/app/table-context";
import { ReservationProvider } from "@/app/reservation-context";
import { DriverProvider } from "@/app/driver-context";
import { StaffScheduleProvider } from "@/app/staff-schedule-context";
import { SubscriptionProvider } from "@/app/subscription-context";
import { CustomizationProvider } from "@/app/customization-context";
import { CorporateProvider } from "@/app/corporate-context";
import { WhatsAppProvider } from "@/app/whatsapp-context";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/menu", label: "Menu", icon: MenuIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/reports", label: "Reports", icon: FileText },
  { href: "/admin/inventory", label: "Inventory", icon: PackageIcon },
  { href: "/admin/promos", label: "Promos", icon: Tag },
  { href: "/admin/staff", label: "Staff", icon: UserSquare },
  { href: "/admin/newsletter", label: "Newsletter", icon: MailIcon },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/talabat", label: "External Orders", icon: ShoppingCart },
  { href: "/corporate", label: "Corporate", icon: Building2 },
  { href: "/whatsapp", label: "WhatsApp", icon: MessageCircle },
  { href: "/subscriptions", label: "Subscriptions", icon: UtensilsCrossed },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      <OrderHistoryProvider>
        <ReservationProvider>
          <TableProvider>
            <ReviewsProvider>
              <ShiftProvider>
                <InventoryProvider>
                  <StaffProvider>
                    <DriverProvider>
                      <StaffScheduleProvider>
                        <SubscriptionProvider>
                          <CustomizationProvider>
                            <CorporateProvider>
                              <WhatsAppProvider>
                                <div className="min-h-screen bg-vanilla/30">
                                  <div className="flex">
                                    <aside className="fixed top-0 left-0 z-40 h-screen w-64 border-r border-chocolate/10 bg-white">
                                      <div className="p-6">
                                        <h1 className="font-playfair text-2xl font-bold text-chocolate">Admin Panel</h1>
                                        <p className="text-sm text-chocolate/60 mt-1">Happy Truffles Cafe</p>
                                      </div>
                                      <nav className="px-4 space-y-1">
                                        {navItems.map((item) => {
                                          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                                          const Icon = item.icon;
                                          return (
                                            <Link
                                              key={item.href}
                                              href={item.href}
                                              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                                isActive
                                                  ? "bg-truffle/10 text-truffle"
                                                  : "text-chocolate hover:bg-chocolate/5"
                                              }`}
                                            >
                                              <Icon size={18} />
                                              {item.label}
                                            </Link>
                                          );
                                        })}
                                      </nav>
                                    </aside>
                                    <main className="flex-1 ml-64">
                                      <div className="p-8">{children}</div>
                                    </main>
                                  </div>
                                </div>
                              </WhatsAppProvider>
                            </CorporateProvider>
                          </CustomizationProvider>
                        </SubscriptionProvider>
                      </StaffScheduleProvider>
                    </DriverProvider>
                  </StaffProvider>
                </InventoryProvider>
              </ShiftProvider>
            </ReviewsProvider>
          </TableProvider>
        </ReservationProvider>
      </OrderHistoryProvider>
    </AuthProvider>
  );
}
