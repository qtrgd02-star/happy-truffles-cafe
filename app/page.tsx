"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/app/theme-context";
import { useAuth } from "@/app/auth-context";
import { useLanguage } from "@/app/language-context";
import { usePromos } from "@/app/promo-context";
import { useToast } from "@/app/toast-context";
import Image from "next/image";
import {
  Menu,
  X,
  MapPin,
  Phone,
  Clock,
  Instagram,
  Facebook,
  ChevronUp,
  Star,
  Coffee,
  UtensilsCrossed,
  GlassWater,
  Cookie,
  Heart,
  Search,
  Sun,
  Moon,
  LogOut,
  User,
  Tag,
  ShoppingCart,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

import { menuItems } from "./menu-data";
import { useCart } from "./cart-context";
import { useWishlist } from "./wishlist-context";
import { useRecentlyViewed } from "./recently-viewed-context";
import CartDrawer from "./cart-drawer";
import { CookieConsent } from "./components/cookie-consent";
import { testimonials } from "./reviews-data";
import { useReviews } from "@/app/reviews-context";

const galleryImages = [
  "/gallery-1.jpg",
  "/gallery-2.jpg",
  "/gallery-3.jpg",
  "/gallery-4.jpg",
  "/gallery-5.jpg",
  "/gallery-6.jpg",
  "/gallery-7.jpg",
  "/gallery-8.jpg",
];

function SearchAutocomplete({
  value,
  onChange,
  inputClassName,
  dropdownClassName,
}: {
  value: string;
  onChange: (v: string) => void;
  inputClassName?: string;
  dropdownClassName?: string;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    const q = value.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      return;
    }
    const uniqueTitles = Array.from(new Set(menuItems.map((item) => item.title)));
    const matches = uniqueTitles
      .filter((title) => title.toLowerCase().includes(q))
      .slice(0, 8);
    setSuggestions(matches);
    setActiveIndex(-1);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        isInternalChange.current = true;
        onChange(suggestions[activeIndex]);
        setSuggestions([]);
      } else {
        const menuSection = document.getElementById("menu");
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${dropdownClassName || ""}`}>
      <input
        type="text"
        placeholder="Search menu..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`pl-10 pr-10 py-2 rounded-full border border-chocolate/10 bg-white/90 backdrop-blur-sm text-chocolate placeholder:text-chocolate/40 focus:outline-none focus:ring-2 focus:ring-truffle/50 ${inputClassName || "w-64"}`}
      />
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate/40"
        size={18}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-chocolate/40 hover:text-chocolate"
        >
          <X size={16} />
        </button>
      )}
      {suggestions.length > 0 && (
        <ul
          className={`absolute z-50 mt-1 bg-white border border-chocolate/10 rounded-xl shadow-lg max-h-48 overflow-y-auto ${dropdownClassName || "w-64"}`}
        >
          {suggestions.map((s, i) => (
            <li
              key={s}
              onClick={() => {
                isInternalChange.current = true;
                onChange(s);
                setSuggestions([]);
              }}
              className={`px-4 py-2 cursor-pointer text-sm truncate ${
                i === activeIndex ? "bg-truffle/10 text-truffle" : "text-chocolate hover:bg-chocolate/5"
              }`}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Home() {
  const { wishlistCount } = useWishlist();
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { reviews, addReview, refreshReviews } = useReviews();
  const { promos } = usePromos();
  const { addToCart, cartCount } = useCart();
  const { showToast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const [promoPopupDismissed, setPromoPopupDismissed] = useState(false);
  const [itemQuantities, setItemQuantities] = useState<Record<number, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isPromoValid = (promo: any) => {
    if (!promo.validUntil) return true;
    const until = new Date(promo.validUntil);
    const now = new Date();
    const endOfDay = new Date(until.getFullYear(), until.getMonth(), until.getDate() + 1);
    return now < endOfDay;
  };

  useEffect(() => {
    refreshReviews();
  }, [refreshReviews]);

  useEffect(() => {
    const activePromos = promos.filter((p) => p.active && isPromoValid(p));
    if (activePromos.length > 0 && !promoPopupDismissed) {
      const timer = setTimeout(() => {
        setShowPromoPopup(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [promos, promoPopupDismissed]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: "", max: "" });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [contactErrors, setContactErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [contactSent, setContactSent] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });
  const [reviewErrors, setReviewErrors] = useState<{ name?: string; email?: string; comment?: string }>({});
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const categories = ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))];

  const filteredMenuItems = menuItems.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      String(item.price).includes(q);
    const matchesCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory;
    const matchesFeatured = !showFeaturedOnly || item.highlight;
    const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
    const matchesPrice = item.price >= minPrice && item.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesFeatured && matchesPrice;
  });

  const sortedMenuItems = [...filteredMenuItems].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  const toggleDescription = (index: number) => {
    setExpandedDescriptions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleProductClick = (item: (typeof menuItems)[0]) => {
    addToRecentlyViewed({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
    });
  };

  const handleAddToCart = (item: (typeof menuItems)[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const qty = itemQuantities[item.id] || 1;
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
      });
    }
    showToast(`Added ${qty} x ${item.title} to cart`);
    setItemQuantities((prev) => ({ ...prev, [item.id]: 1 }));
  };

  const updateItemQuantity = (itemId: number, delta: number) => {
    setItemQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta),
    }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!contactForm.name.trim()) newErrors.name = "Name is required";
    if (!contactForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!contactForm.message.trim()) newErrors.message = "Message is required";
    setContactErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setContactSent(true);
    setContactForm({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setContactSent(false), 5000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: name === "rating" ? Number(value) : value }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string; comment?: string } = {};
    if (!reviewForm.name.trim()) newErrors.name = "Name is required";
    if (!reviewForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewForm.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!reviewForm.comment.trim()) newErrors.comment = "Review is required";
    setReviewErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    addReview({
      name: reviewForm.name.trim(),
      text: reviewForm.comment.trim(),
      rating: reviewForm.rating,
    });
    setReviewSubmitted(true);
    setReviewForm({ name: "", email: "", rating: 5, comment: "" });
    setTimeout(() => setReviewSubmitted(false), 5000);
  };

  return (
    <main className="min-h-screen bg-warmWhite dark:bg-neutral-900">
      {/* Navbar */}
            <motion.nav
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-chocolate/90 backdrop-blur-lg shadow-lg transition-all duration-300"
            >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
             <a
               href="#"
               className="font-playfair text-2xl font-bold text-chocolate dark:text-vanilla transition-colors"
             >
               Happy Truffles
             </a>

             {/* Desktop Links */}
             <div className="hidden md:flex items-center gap-6">
                {["Home", "About", "Menu", "Gallery", "Reviews", "Contact", "Orders", "Reservations"].map(
                  (item) => (
                    <a
                      key={item}
                      href={["Orders", "Reservations", "QR", "Gift Cards", "Table Order", "Kitchen"].includes(item) ? `/${item.toLowerCase()}` : `#${item.toLowerCase()}`}
                      className="text-chocolate/80 dark:text-vanilla/80 hover:text-truffle transition-colors font-medium text-sm tracking-wide"
                    >
                      {item}
                    </a>
                  )
                )}
               <button
                 onClick={() => setIsSearchOpen(!isSearchOpen)}
                 className="text-chocolate/80 dark:text-vanilla/80 hover:text-truffle transition-colors"
                 aria-label="Search"
               >
                 <Search size={20} />
               </button>
               <Link
                 href="/wishlist"
                 className="text-chocolate/80 dark:text-vanilla/80 hover:text-truffle transition-colors flex items-center gap-1"
               >
                 <Heart size={20} />
                 {wishlistCount > 0 && (
                   <span className="bg-truffle text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                     {wishlistCount}
                   </span>
                 )}
               </Link>
                <button
                  onClick={toggleTheme}
                  className="text-chocolate/80 dark:text-vanilla/80 hover:text-truffle transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button
                  onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                  className="text-chocolate/80 dark:text-vanilla/80 hover:text-truffle transition-colors text-sm font-medium px-2 py-1 border border-chocolate/20 rounded"
                  aria-label="Toggle language"
                >
                  {language === "en" ? "عربي" : "EN"}
                </button>
                {user ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-chocolate/80 dark:text-vanilla/80 hidden md:inline">{user.name}</span>
                    <button
                      onClick={logout}
                      className="text-chocolate/80 dark:text-vanilla/80 hover:text-truffle transition-colors"
                      aria-label="Logout"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="text-chocolate/80 dark:text-vanilla/80 hover:text-truffle transition-colors"
                    aria-label="Login"
                  >
                    <User size={20} />
                  </Link>
                )}
                <CartDrawer scrolled={true} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
              <div
                className={`transition-all duration-300 relative ${
                  isSearchOpen ? "w-64 opacity-100" : "w-0 opacity-0"
                }`}
              >
                <SearchAutocomplete
                  value={searchQuery}
                  onChange={setSearchQuery}
                  inputClassName="w-64"
                  dropdownClassName="w-64"
                />
              </div>
              <a
                href="#contact"
                className="bg-truffle text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-chocolate transition-colors shadow-lg shadow-truffle/20"
              >
                Visit Us
              </a>
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X size={28} className="text-chocolate dark:text-vanilla" />
              ) : (
                <Menu size={28} className="text-chocolate dark:text-vanilla" />
              )}
            </button>
          </div>

          {/* Mobile Search */}
          {mobileOpen && (
            <div className="md:hidden px-4 pb-4">
              <SearchAutocomplete
                value={searchQuery}
                onChange={setSearchQuery}
                inputClassName="w-full"
                dropdownClassName="w-full"
              />
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/90 dark:bg-chocolate/95 backdrop-blur-lg border-t-2 border-t-truffle/20"
          >
            <div className="px-4 py-6 space-y-4">
              {["Home", "About", "Menu", "Gallery", "Reviews", "Contact"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileOpen(false)}
                    className="block text-chocolate/80 dark:text-vanilla/80 hover:text-truffle font-medium text-lg transition-colors"
                  >
                    {item}
                  </a>
                )
              )}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="inline-block bg-truffle text-white px-6 py-3 rounded-full font-medium mt-2 hover:bg-chocolate transition-colors"
              >
                Visit Us
              </a>
              <button
                onClick={() => { setIsCartOpen(true); setMobileOpen(false); }}
                className="w-full mt-3 bg-truffle text-white px-6 py-3 rounded-full font-medium hover:bg-chocolate transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                View Cart {cartCount > 0 && `(${cartCount})`}
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Promo Popup */}
      {showPromoPopup && promos.filter((p) => p.active && isPromoValid(p)).length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowPromoPopup(false); setPromoPopupDismissed(true); }} />
          
          {/* Balloon animations */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ y: 100 + Math.random() * 100, x: Math.random() * 100, opacity: 0 }}
                animate={{ 
                  y: -100 - Math.random() * 200, 
                  x: Math.random() * 100,
                  opacity: [0, 1, 1, 0],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2, 
                  repeat: Infinity, 
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
                style={{ left: `${10 + i * 12}%`, bottom: 0 }}
              >
                <div 
                  className="w-8 h-10 rounded-full opacity-80"
                  style={{ 
                    backgroundColor: ['#ff6b9d', '#c44569', '#f8b500', '#ff9f43', '#ee5a24', '#ffd32a', '#ff6b81', '#ffa502'][i],
                    boxShadow: `inset -2px -2px 4px rgba(0,0,0,0.1), inset 2px 2px 4px rgba(255,255,255,0.3)`
                  }}
                />
                <div className="w-px h-6 bg-chocolate/30 mx-auto" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border-4 border-truffle/20"
          >
            <button
              onClick={() => {
                setShowPromoPopup(false);
                setPromoPopupDismissed(true);
              }}
              className="absolute top-4 right-4 text-chocolate/60 hover:text-chocolate z-10"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-truffle/20 to-matcha/20 rounded-full mb-4"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Tag className="text-truffle" size={40} />
              </motion.div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-playfair text-4xl font-bold text-chocolate dark:text-vanilla mb-2"
            >
              🎉 Congratulations!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-chocolate/70 text-lg mb-4"
            >
              You have a special offer!
            </motion.p>

            {promos.filter((p) => p.active && isPromoValid(p)).slice(0, 1).map((promo) => (
              <motion.div
                key={promo.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="mt-4 bg-gradient-to-r from-truffle/10 to-matcha/10 rounded-2xl p-6"
              >
                <h3 className="font-playfair text-5xl font-bold text-truffle mb-3">
                  {promo.code}
                </h3>
                <p className="text-chocolate/70 text-xl mb-4 font-semibold">
                  {promo.type === "percentage" && `${promo.value}% OFF`}
                  {promo.type === "fixed" && `QAR ${promo.value} OFF`}
                  {promo.type === "item" && `${promo.value}% OFF ITEM`}
                </p>
                {promo.minOrderAmount && (
                  <p className="text-sm text-chocolate/60">Min order: QAR {promo.minOrderAmount}</p>
                )}
                {promo.maxUses && (
                  <p className="text-sm text-chocolate/60">Max uses: {promo.maxUses}</p>
                )}
                <p className="text-xs text-chocolate/50 mt-3">
                  Valid until {new Date(promo.validUntil).toLocaleDateString()}
                </p>
              </motion.div>
            ))}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={() => {
                setShowPromoPopup(false);
                setPromoPopupDismissed(true);
              }}
              className="mt-6 w-full bg-gradient-to-r from-truffle to-matcha text-white py-3 rounded-full font-bold text-lg hover:shadow-lg transition-all hover:scale-105"
            >
              🎊 Claim Offer!
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/hero.jpg')`,
          }}
        />
        {/* TODO: Replace with actual Happy Truffles Cafe hero image */}
        <div className="absolute inset-0 bg-gradient-to-b from-chocolate/70 via-chocolate/50 to-chocolate/80" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block bg-truffle/90 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6 tracking-wide"
          >
            ⭐ Rated 5.0 in Doha
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold text-vanilla mb-6 leading-tight"
          >
            Joy in Every Bite <br className="hidden md:block" />
            at Happy Truffles
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-vanilla/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Experience the perfect blend of artisan chocolate truffles,
            specialty coffee, matcha, and cozy vibes at Gold Plaza, Abu
            Hamour.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#menu"
              className="bg-truffle hover:bg-chocolate text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-xl shadow-truffle/30 text-center"
            >
              Explore Menu
            </a>
            <a
              href="#contact"
              className="border-2 border-vanilla text-vanilla hover:bg-vanilla hover:text-chocolate px-8 py-4 rounded-full font-semibold transition-all duration-300 text-center"
            >
              Get Directions
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-vanilla/50 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-vanilla/70 rounded-full" />
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/about.jpg"
                alt="Happy Truffles Cafe interior"
                width={1200}
                height={500}
                className="object-cover w-full h-[500px]"
              />
              {/* TODO: Replace with actual Happy Truffles Cafe interior image */}
            </div>
            <div className="absolute -bottom-6 -right-6 bg-truffle text-white p-6 rounded-2xl shadow-xl hidden md:block">
              <p className="font-playfair text-3xl font-bold">5.0</p>
              <p className="text-sm mt-1">Rating</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-chocolate dark:text-vanilla">
              About Us
            </h2>
            <div className="w-20 h-1.5 bg-truffle rounded-full" />
            <p className="text-chocolate/80 text-lg leading-relaxed dark:text-vanilla/80">
              Welcome to Happy Truffles Cafe — a cozy retreat in the heart of
              Gold Plaza, Abu Hamour. We believe great food and warm company
              make the perfect recipe for happiness.
            </p>
            <p className="text-chocolate/80 text-lg leading-relaxed dark:text-vanilla/80">
              Whether you are catching up with friends, spending time with
              family, or satisfying a late-night dessert craving, our doors are
              open until <span className="font-semibold text-truffle">11:30 PM</span>{" "}
              (and till <span className="font-semibold text-truffle">1:00 AM</span>{" "}
              on weekends).
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="bg-matcha/20 p-4 rounded-xl">
                <Heart className="text-matcha" size={28} />
              </div>
              <p className="text-chocolate/70 font-medium dark:text-vanilla/70">
                Made with love, served with a smile.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Signature Menu Section */}
      <section id="menu" className="py-24 px-4 bg-vanilla/30 dark:bg-neutral-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-chocolate dark:text-vanilla mb-4">
              Our Full Menu
            </h2>
            <div className="w-20 h-1.5 bg-truffle rounded-full mx-auto" />
            <button
              onClick={() => window.print()}
              className="mt-4 text-sm text-chocolate/60 hover:text-truffle transition-colors no-print"
            >
              Print Menu
            </button>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-truffle text-white"
                      : "bg-white dark:bg-neutral-800 text-chocolate dark:text-vanilla hover:bg-truffle/10"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                placeholder="Min QAR"
                className="w-24 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
              />
              <span className="text-chocolate/60">-</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                placeholder="Max QAR"
                className="w-24 border border-chocolate/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
              />
            </div>
            <button
              onClick={() => setPriceRange({ min: "", max: "" })}
              className="text-sm text-chocolate/60 hover:text-truffle transition-colors"
            >
              Clear Price Filter
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 mb-4">
            <button
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                showFeaturedOnly
                  ? "bg-truffle text-white"
                  : "bg-white dark:bg-neutral-800 text-chocolate dark:text-vanilla hover:bg-truffle/10"
              }`}
            >
              ⭐ Featured
            </button>
            <div className="flex items-center gap-2">
              <span className="text-chocolate/60 text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-chocolate/20 dark:border-neutral-600 rounded-full px-3 py-1.5 text-sm text-chocolate dark:text-vanilla focus:outline-none focus:ring-2 focus:ring-truffle"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3"
          >
            {sortedMenuItems.map((item, index) => (
              <Link href={`/product/${item.id}`} key={item.id} className="block" onClick={() => handleProductClick(item)}>
                <motion.div
                  key={item.title + index}
                  variants={fadeUp}
                  whileHover={{ y: -3 }}
                  className="flex w-full min-w-0 flex-col gap-2 overflow-hidden bg-white dark:bg-neutral-800 rounded-2xl border border-slate-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="cursor-pointer relative bg-vanilla/40 overflow-hidden w-full aspect-square">
                    <div className="relative h-full w-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full transition-transform duration-500"
                      />
                    </div>
                    {item.highlight && (
                      <span className="absolute top-2 left-2 bg-truffle text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        BEST VALUE
                      </span>
                    )}
                    <div className="absolute bottom-2 right-2 z-10 text-chocolate dark:text-vanilla font-medium text-xs leading-tight text-center align-middle h-8 flex items-center gap-1 bg-white border border-chocolate/20 rounded-full px-2 py-1">
                      QAR {item.price}
                    </div>
                  </div>
                  <div className="flex w-full min-w-0 flex-col gap-1 p-2">
                    <p className="font-normal text-chocolate dark:text-vanilla line-clamp-1 truncate overflow-hidden cursor-pointer text-[0.875rem] leading-[1.25rem] tracking-[-0.006rem]">
                      {item.title}
                    </p>
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate text-truffle text-[18px] leading-[1.25rem] tracking-[0rem] font-semibold">
                        QAR {item.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateItemQuantity(item.id, -1); }}
                        className="w-6 h-6 rounded-full border border-chocolate/20 flex items-center justify-center hover:bg-chocolate/5 transition-colors"
                      >
                        <span className="text-chocolate text-xs leading-none">-</span>
                      </button>
                      <span className="w-6 text-center text-xs font-semibold text-chocolate">
                        {itemQuantities[item.id] || 1}
                      </span>
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateItemQuantity(item.id, 1); }}
                        className="w-6 h-6 rounded-full border border-chocolate/20 flex items-center justify-center hover:bg-chocolate/5 transition-colors"
                      >
                        <span className="text-chocolate text-xs leading-none">+</span>
                      </button>
                      <button
                        onClick={(e) => handleAddToCart(item, e)}
                        className="flex-1 bg-truffle text-white py-1 rounded-full text-xs font-semibold hover:bg-chocolate transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
          {searchQuery.trim() && filteredMenuItems.length === 0 && (
            <p className="text-center text-chocolate/60 dark:text-vanilla/60 mt-6">
              No matching items found. Try a different keyword like <button type="button" onClick={() => setSearchQuery("truffles")} className="text-truffle underline">truffles</button>, <button type="button" onClick={() => setSearchQuery("coffee")} className="text-truffle underline">coffee</button>, or <button type="button" onClick={() => setSearchQuery("sandwich")} className="text-truffle underline">sandwich</button>.
            </p>
          )}
          {searchQuery.trim() && filteredMenuItems.length > 0 && (
            <p className="text-center text-chocolate/60 dark:text-vanilla/60 mt-6">
              {filteredMenuItems.length} result{filteredMenuItems.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
            </p>
          )}
          {sortedMenuItems.length === 0 && selectedCategory !== "All" && (
            <p className="text-center text-chocolate/60 dark:text-vanilla/60 mt-6">
              No items found in this category.
            </p>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-chocolate dark:text-vanilla mb-4">
              Gallery
            </h2>
            <div className="w-20 h-1.5 bg-truffle rounded-full mx-auto" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative overflow-hidden rounded-2xl aspect-square cursor-pointer group"
              >
                <Image
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                {/* TODO: Replace with actual gallery images */}
                <div className="absolute inset-0 bg-chocolate/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                    <Star className="text-white" size={28} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promos Section */}
      {promos.filter((p) => p.active && isPromoValid(p)).length > 0 && (
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-chocolate dark:text-vanilla mb-4">
                Special Offers
              </h2>
              <div className="w-20 h-1.5 bg-truffle rounded-full mx-auto" />
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {promos
                .filter((p) => p.active && isPromoValid(p))
                .map((promo, index) => (
                  <motion.div
                    key={promo.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-truffle/20"
                  >
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-truffle/10 rounded-full mb-4">
                        <Tag className="text-truffle" size={24} />
                      </div>
                      <h3 className="font-playfair text-2xl font-bold text-chocolate dark:text-vanilla mb-2">
                        {promo.code}
                      </h3>
                      <p className="text-chocolate/70 text-sm mb-4">
                        {promo.type === "percentage" && `${promo.value}% off`}
                        {promo.type === "fixed" && `QAR ${promo.value} off`}
                        {promo.type === "item" && `${promo.value}% off item`}
                      </p>
                      {promo.minOrderAmount && (
                        <p className="text-xs text-chocolate/50">Min order: QAR {promo.minOrderAmount}</p>
                      )}
                      {promo.maxUses && (
                        <p className="text-xs text-chocolate/50">Max uses: {promo.maxUses}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews / Testimonials Section */}
       <section
         id="reviews"
         className="py-24 px-4 bg-matcha/10 dark:bg-neutral-800/50"
       >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-chocolate dark:text-vanilla mb-4">
              Loved by Doha (5.0 ⭐)
            </h2>
            <div className="w-20 h-1.5 bg-truffle rounded-full mx-auto" />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {[...testimonials, ...reviews.filter((r) => r.status === "approved")].map((review, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-truffle fill-truffle"
                      size={18}
                    />
                  ))}
                </div>
                <p className="text-chocolate/80 text-lg leading-relaxed mb-6 italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-truffle/10 rounded-full flex items-center justify-center">
                    <span className="font-playfair font-bold text-truffle">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <p className="font-semibold text-chocolate dark:text-vanilla">{review.name}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-chocolate dark:text-vanilla mb-4">
              Leave a Review
            </h2>
            <div className="w-20 h-1.5 bg-truffle rounded-full mx-auto" />
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div>
                <label className="block text-chocolate dark:text-vanilla font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={reviewForm.name}
                  onChange={handleReviewChange}
                  placeholder="John Doe"
                  required
                  className="w-full border border-chocolate/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-truffle"
                />
                {reviewErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{reviewErrors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-chocolate dark:text-vanilla font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={reviewForm.email}
                  onChange={handleReviewChange}
                  placeholder="your@email.com"
                  required
                  className="w-full border border-chocolate/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-truffle"
                />
                {reviewErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{reviewErrors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-chocolate dark:text-vanilla font-medium mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleReviewChange({ target: { name: "rating", value: star.toString() } } as any)}
                      className={`text-2xl ${reviewForm.rating >= star ? "text-truffle" : "text-chocolate/20"} hover:text-truffle transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-chocolate dark:text-vanilla font-medium mb-2">
                  Your Review
                </label>
                <textarea
                  name="comment"
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                  rows={4}
                  placeholder="Share your experience at Happy Truffles Cafe..."
                  required
                  className="w-full border border-chocolate/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-truffle resize-none"
                />
                {reviewErrors.comment && (
                  <p className="text-red-500 text-sm mt-1">{reviewErrors.comment}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-truffle text-white py-4 rounded-full font-semibold hover:bg-chocolate transition-colors shadow-lg shadow-truffle/20"
              >
                Submit Review
              </button>
              {reviewSubmitted && (
                <p className="text-green-600 text-center font-medium">
                  Thank you for your review! It will be reviewed shortly.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Contact & Location Section */}
      <section id="contact" className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-chocolate dark:text-vanilla">
              Visit Us
            </h2>
            <div className="w-20 h-1.5 bg-truffle rounded-full" />

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-truffle/10 p-3 rounded-xl">
                  <MapPin className="text-truffle" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-chocolate dark:text-vanilla mb-1">Location</h3>
                  <p className="text-chocolate/70">
                    Gold Plaza, Abu Hamour, Doha, Qatar
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-truffle/10 p-3 rounded-xl">
                  <Phone className="text-truffle" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-chocolate dark:text-vanilla mb-1">Phone</h3>
                  <a
                    href="tel:+97431590002"
                    className="text-chocolate/70 hover:text-truffle transition-colors"
                  >
                    +974 3159 0002
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-truffle/10 p-3 rounded-xl">
                  <Clock className="text-truffle" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-chocolate dark:text-vanilla mb-1">
                    Opening Hours
                  </h3>
                  <p className="text-chocolate/70">
                    Daily: 6:00 AM – 11:30 PM
                    <br />
                    Friday & Saturday: Till 1:00 AM
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors shadow-lg shadow-truffle/20"
            >
              Open in Google Maps
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl p-8">
              <h3 className="font-playfair text-3xl font-bold text-chocolate dark:text-vanilla mb-6">
                Send Us a Message
              </h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-chocolate dark:text-vanilla font-medium text-sm mb-2">
                    Name
                  </label>
                   <input
                     type="text"
                     name="name"
                     value={contactForm.name}
                     onChange={handleContactChange}
                     placeholder="Your Name"
                     required
                     className="w-full border border-chocolate/20 dark:border-neutral-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-truffle text-chocolate dark:text-vanilla dark:bg-neutral-800"
                   />
                  {contactErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{contactErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-chocolate font-medium text-sm mb-2">
                    Email
                  </label>
                   <input
                     type="email"
                     name="email"
                     value={contactForm.email}
                     onChange={handleContactChange}
                     placeholder="your@email.com"
                     required
                     className="w-full border border-chocolate/20 dark:border-neutral-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-truffle text-chocolate dark:text-vanilla dark:bg-neutral-800"
                   />
                  {contactErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{contactErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-chocolate font-medium text-sm mb-2">
                    Phone
                  </label>
                   <input
                     type="tel"
                     name="phone"
                     value={contactForm.phone}
                     onChange={handleContactChange}
                     placeholder="+974 XXXX XXXX"
                     className="w-full border border-chocolate/20 dark:border-neutral-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-truffle text-chocolate dark:text-vanilla dark:bg-neutral-800"
                   />
                </div>
                <div>
                  <label className="block text-chocolate font-medium text-sm mb-2">
                    Message
                  </label>
                   <textarea
                     name="message"
                     value={contactForm.message}
                     onChange={handleContactChange}
                     rows={4}
                     placeholder="How can we help you?"
                     required
                     className="w-full border border-chocolate/20 dark:border-neutral-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-truffle resize-none text-chocolate dark:text-vanilla dark:bg-neutral-800"
                   />
                  {contactErrors.message && (
                    <p className="text-red-500 text-xs mt-1">{contactErrors.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-truffle text-white py-4 rounded-full font-semibold text-lg hover:bg-chocolate transition-colors shadow-lg shadow-truffle/20 flex items-center justify-center gap-2"
                >
                  Send Message
                </button>
                {contactSent && (
                  <p className="text-green-600 text-center text-sm font-medium">
                    Thank you! Your message has been sent.
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="py-12 px-4 bg-vanilla/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-playfair text-3xl font-bold text-chocolate dark:text-vanilla mb-6">
              Recently Viewed
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {recentlyViewed.map((item) => (
                <Link href={`/product/${item.id}`} key={item.id} className="flex-shrink-0 w-40">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                    <div className="aspect-square bg-vanilla/40">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={160}
                        height={160}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-chocolate line-clamp-1">{item.title}</p>
                      <p className="text-sm font-semibold text-truffle mt-1">
                        QAR {item.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-chocolate text-vanilla py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="font-playfair text-3xl font-bold mb-4">
              Happy Truffles
            </h3>
            <p className="text-vanilla/70 max-w-md leading-relaxed">
              A cozy cafe in Gold Plaza, Abu Hamour, serving artisan truffles,
              specialty coffee, matcha, and warm vibes since day one.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "About", "Menu", "Gallery", "Reviews", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-vanilla/70 hover:text-truffle transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Newsletter</h4>
            <p className="text-vanilla/70 text-sm mb-4">
              Get seasonal treats and special offers delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2 rounded-full text-chocolate focus:outline-none focus:ring-2 focus:ring-truffle"
              />
              <button
                type="submit"
                className="w-full bg-truffle text-white py-2 rounded-full font-semibold hover:bg-chocolate transition-colors"
              >
                Subscribe
              </button>
              {newsletterSubscribed && (
                <p className="text-green-400 text-xs mt-2 text-center">
                  Thank you for subscribing!
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-vanilla/10 text-center text-vanilla/50 text-sm">
          <p>© 2024 Happy Truffles Cafe. All rights reserved.</p>
        </div>
      </footer>

      {/* Scroll to Top */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 bg-truffle/90 backdrop-blur-md text-white p-4 rounded-full shadow-xl shadow-truffle/30 hover:bg-chocolate transition-colors z-50 group"
          aria-label="Back to top"
        >
          <ChevronUp size={24} />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-chocolate text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Back to top
          </span>
        </motion.button>
      )}
      <CookieConsent />
    </main>
  );
}
