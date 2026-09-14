"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/app/cart-context";
import { useToast } from "@/app/toast-context";
import { useWishlist } from "@/app/wishlist-context";
import { useReviews } from "@/app/reviews-context";
import { useCustomizations } from "@/app/customization-context";
import { menuItems } from "@/app/menu-data";
import { testimonials, type Review } from "@/app/reviews-data";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Clock,
  Tag,
  Heart,
  User,
  Mail,
  MessageSquare,
  Share2,
  Copy,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function extractFeatures(description: string): string[] {
  const features: string[] = [];
  const lower = description.toLowerCase();

  if (lower.includes("handcrafted") || lower.includes("handmade")) {
    features.push("Handcrafted with care");
  }
  if (lower.includes("premium")) {
    features.push("Premium ingredients");
  }
  if (lower.includes("gift")) {
    features.push("Perfect for gifting");
  }
  if (lower.includes("party") || lower.includes("celebration")) {
    features.push("Great for celebrations");
  }
  if (lower.includes("sharing") || lower.includes("share")) {
    features.push("Perfect for sharing");
  }
  if (lower.includes("fresh")) {
    features.push("Freshly made");
  }
  if (lower.includes("chocolate")) {
    features.push("Rich chocolate flavor");
  }
  if (lower.includes("coffee")) {
    features.push("Coffee lovers' favorite");
  }
  if (lower.includes("matcha")) {
    features.push("Premium matcha blend");
  }
  if (lower.includes("summer") || lower.includes("refreshing")) {
    features.push("Refreshing summer treat");
  }
  if (lower.includes("graduation")) {
    features.push("Graduation special");
  }
  if (lower.includes("birthday")) {
    features.push("Birthday celebration");
  }
  if (lower.includes("wedding") || lower.includes("bride")) {
    features.push("Wedding special");
  }

  if (features.length === 0) {
    features.push("Made with premium ingredients");
    features.push("Perfect for any occasion");
  }

  return features.slice(0, 4);
}

function Stars({
  count,
  size = 16,
}: {
  count: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= count
              ? "text-truffle fill-truffle"
              : "text-chocolate/20"
          }
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-vanilla/40 rounded-2xl p-6 shadow-sm">
      <Stars count={review.rating} />
      <p className="text-chocolate/80 text-sm leading-relaxed mt-3 mb-4 italic">
        &ldquo;{review.text}&rdquo;
      </p>
      {review.photo && (
        <img src={review.photo} alt="Review photo" className="w-full h-48 object-cover rounded-xl mb-4 border border-chocolate/10" />
      )}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-truffle/10 rounded-full flex items-center justify-center">
          <span className="font-playfair font-bold text-truffle text-sm">
            {review.name.charAt(0)}
          </span>
        </div>
        <p className="font-semibold text-chocolate dark:text-vanilla text-sm">
          {review.name}
        </p>
      </div>
    </div>
  );
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { addToCart, cartCount } = useCart();
  const { showToast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { reviews: localReviews, addReview } = useReviews();
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
    photo: "",
  });
  const [reviewErrors, setReviewErrors] = useState<{
    name?: string;
    email?: string;
    comment?: string;
  }>({});
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const { getCustomizations } = useCustomizations();
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string>>({});
  const itemCustomizations = getCustomizations(id);

  const allReviews = useMemo(() => [...testimonials, ...localReviews], [localReviews]);

  const averageRating = useMemo(() => {
    if (allReviews.length === 0) return 0;
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / allReviews.length) * 10) / 10;
  }, [allReviews]);

  const item = menuItems.find((p) => p.id === id);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vanilla/30">
        <div className="text-center">
          <h1 className="text-4xl font-playfair font-bold text-chocolate dark:text-vanilla mb-4">
            Product Not Found
          </h1>
          <Link href="/#menu" className="text-truffle hover:underline">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const features = extractFeatures(item.description);

  const sizes = item.sizes ?? [];
  const currentPrice = sizes.length > 0 ? sizes[selectedSizeIndex].price : item.price;

  const shareData = {
    title: item.title,
    text: `${item.title} - QAR ${item.price} at Happy Truffles Cafe. ${item.description}`,
    url: typeof window !== "undefined" ? window.location.href : "",
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          showToast("Share failed");
        }
      }
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${item.title} - QAR ${item.price} at Happy Truffles Cafe\n${shareData.url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleXShare = () => {
    const text = encodeURIComponent(`${item.title} - QAR ${item.price} at Happy Truffles Cafe`);
    window.open(`https://x.com/intent/post?text=${text}&url=${encodeURIComponent(shareData.url)}`, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      showToast("Link copied to clipboard");
    } catch {
      showToast("Failed to copy link");
    }
  };

  const currentCategory = item.category;

  const recommendations = menuItems
    .filter((p) => p.id !== item.id)
    .sort((a, b) => {
      const aCat = a.category;
      const bCat = b.category;
      const aScore = (a.icon === item.icon ? 0 : 10) + (aCat === currentCategory ? 0 : 1);
      const bScore = (b.icon === item.icon ? 0 : 10) + (bCat === currentCategory ? 0 : 1);
      return aScore - bScore;
    })
    .slice(0, 4);

  const handleReviewChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleReviewPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewForm((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {
      name?: string;
      email?: string;
      comment?: string;
    } = {};
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
      photo: reviewForm.photo || undefined,
    });
    setReviewForm({ name: "", email: "", rating: 5, comment: "", photo: "" });
    setReviewSubmitted(true);
    showToast("Review submitted!");
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-vanilla/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href="/#menu"
          className="inline-flex items-center gap-2 text-chocolate/70 hover:text-truffle transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Menu
        </Link>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative bg-vanilla/40 aspect-square md:aspect-auto">
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-vanilla/40" />
              )}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                priority
                onLoad={() => setImageLoaded(true)}
              />
              {item.highlight && (
                <span className="absolute top-4 left-4 bg-truffle text-white text-xs font-bold px-3 py-1 rounded-full">
                  BEST VALUE
                </span>
              )}
            </div>

            <div className="p-8 md:p-12 flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="font-playfair text-3xl md:text-4xl font-bold text-chocolate dark:text-vanilla leading-tight">
                  {item.title}
                </h1>
                <div className="flex flex-col items-end gap-1 bg-truffle/10 px-3 py-1.5 rounded-full">
                  <div className="flex items-center gap-1">
                    <Star className="text-truffle fill-truffle" size={16} />
                    <span className="text-truffle font-semibold text-sm">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-chocolate/60 text-xs">
                    {allReviews.length} review{allReviews.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-truffle">
                  QAR {currentPrice}
                </span>
                <span className="text-chocolate/60 line-through text-lg">
                  QAR {Math.round(currentPrice * 1.2)}
                </span>
              </div>

              <div className="mb-6">
                  <h3 className="font-semibold text-chocolate dark:text-vanilla mb-2 flex items-center gap-2">
                    <Tag size={18} />
                    Description
                  </h3>
                <p className="text-chocolate/80 leading-relaxed text-base">
                  {item.description}
                </p>
              </div>

              <div className="mb-8">
                  <h3 className="font-semibold text-chocolate dark:text-vanilla mb-3 flex items-center gap-2">
                    <Star size={18} />
                    Features
                  </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-chocolate/80"
                    >
                      <div className="w-2 h-2 rounded-full bg-truffle flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {item.nutrition && (
                <div className="mb-6">
                  <h3 className="font-semibold text-chocolate dark:text-vanilla mb-3 flex items-center gap-2">
                    <Star size={18} />
                    Nutrition
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    <div className="bg-vanilla/30 rounded-xl p-3 text-center">
                      <p className="text-xs text-chocolate/60">Calories</p>
                      <p className="font-bold text-chocolate">{item.nutrition.calories}</p>
                    </div>
                    <div className="bg-vanilla/30 rounded-xl p-3 text-center">
                      <p className="text-xs text-chocolate/60">Protein</p>
                      <p className="font-bold text-chocolate">{item.nutrition.protein}g</p>
                    </div>
                    <div className="bg-vanilla/30 rounded-xl p-3 text-center">
                      <p className="text-xs text-chocolate/60">Carbs</p>
                      <p className="font-bold text-chocolate">{item.nutrition.carbs}g</p>
                    </div>
                    <div className="bg-vanilla/30 rounded-xl p-3 text-center">
                      <p className="text-xs text-chocolate/60">Fat</p>
                      <p className="font-bold text-chocolate">{item.nutrition.fat}g</p>
                    </div>
                    <div className="bg-vanilla/30 rounded-xl p-3 text-center">
                      <p className="text-xs text-chocolate/60">Sugar</p>
                      <p className="font-bold text-chocolate">{item.nutrition.sugar}g</p>
                    </div>
                    <div className="bg-vanilla/30 rounded-xl p-3 text-center">
                      <p className="text-xs text-chocolate/60">Fiber</p>
                      <p className="font-bold text-chocolate">{item.nutrition.fiber}g</p>
                    </div>
                  </div>
                  <p className="text-xs text-chocolate/50 mt-2">Serving size: {item.nutrition.servingSize}</p>
                </div>
              )}

              {item.allergens && (
                <div className="mb-6">
                  <h3 className="font-semibold text-chocolate dark:text-vanilla mb-3 flex items-center gap-2">
                    <Star size={18} />
                    Allergens
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.allergens.contains.map((a) => (
                      <span key={a} className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">Contains: {a}</span>
                    ))}
                    {item.allergens.mayContain.map((a) => (
                      <span key={a} className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">May contain: {a}</span>
                    ))}
                  </div>
                </div>
              )}

              {sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-chocolate dark:text-vanilla mb-3 flex items-center gap-2">
                    <Tag size={18} />
                    Size
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size, index) => (
                      <button
                        key={size.name}
                        onClick={() => {
                          setSelectedSizeIndex(index);
                          setQuantity(1);
                        }}
                        className={`px-5 py-2.5 rounded-full border-2 font-medium transition-colors ${
                          selectedSizeIndex === index
                            ? "border-truffle bg-truffle text-white"
                             : "border-chocolate/20 text-chocolate dark:text-vanilla hover:border-truffle/50"
                        }`}
                      >
                        {size.name} — QAR {size.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {itemCustomizations.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-chocolate dark:text-vanilla mb-3 flex items-center gap-2">
                    <Tag size={18} />
                    Customize
                  </h3>
                  <div className="space-y-4">
                    {itemCustomizations.map((option) => (
                      <div key={option.id}>
                        <label className="block text-sm font-medium text-chocolate dark:text-vanilla mb-2">
                          {option.name} {option.required && <span className="text-red-500">*</span>}
                        </label>
                        {option.type === "select" && (
                          <select
                            value={selectedCustomizations[option.id] || ""}
                            onChange={(e) => setSelectedCustomizations((prev) => ({ ...prev, [option.id]: e.target.value }))}
                            className="w-full border border-chocolate/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
                          >
                            <option value="">Select an option</option>
                            {option.options.map((opt) => (
                              <option key={opt.label} value={opt.label}>
                                {opt.label} {opt.price !== 0 && `(+QAR ${opt.price})`}
                              </option>
                            ))}
                          </select>
                        )}
                        {option.type === "checkbox" && (
                          <div className="space-y-2">
                            {option.options.map((opt) => (
                              <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedCustomizations[option.id] === opt.label}
                                  onChange={(e) => setSelectedCustomizations((prev) => ({ ...prev, [option.id]: e.target.checked ? opt.label : "" }))}
                                  className="rounded border-chocolate/20 text-truffle focus:ring-truffle"
                                />
                                <span className="text-sm text-chocolate/80">{opt.label} (+QAR {opt.price})</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-chocolate dark:text-vanilla font-medium">
                    Quantity:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setQuantity((q) => Math.max(1, q - 1))
                      }
                      className="w-10 h-10 rounded-full border border-chocolate/20 flex items-center justify-center hover:bg-chocolate/5 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold text-chocolate dark:text-vanilla">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 rounded-full border border-chocolate/20 flex items-center justify-center hover:bg-chocolate/5 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const customizationTotal = itemCustomizations.reduce((sum, opt) => {
                      const selected = selectedCustomizations[opt.id];
                      if (!selected) return sum;
                      const option = opt.options.find((o) => o.label === selected);
                      return sum + (option?.price || 0);
                    }, 0);
                    for (let i = 0; i < quantity; i++) {
                      addToCart({
                        id: item.id,
                        title: item.title,
                        price: currentPrice + customizationTotal,
                        image: item.image,
                        customizations: itemCustomizations
                          .filter((opt) => selectedCustomizations[opt.id])
                          .map((opt) => ({
                            name: opt.name,
                            values: [selectedCustomizations[opt.id]],
                            priceAdjustment: opt.options.find((o) => o.label === selectedCustomizations[opt.id])?.price || 0,
                          })),
                      });
                    }
                    showToast("Added to cart");
                  }}
                  className="w-full bg-truffle text-white py-4 rounded-full font-semibold text-lg hover:bg-chocolate transition-colors shadow-lg shadow-truffle/20 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Add to Cart • QAR {(currentPrice * quantity).toFixed(2)}
                </button>

                <button
                  onClick={() => {
                    if (isInWishlist(item.id)) {
                      removeFromWishlist(item.id);
                      showToast("Removed from wishlist");
                    } else {
                      addToWishlist({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        image: item.image,
                      });
                      showToast("Added to wishlist");
                    }
                  }}
                  className="w-full mt-4 border-2 border-chocolate/20 text-chocolate dark:text-vanilla py-4 rounded-full font-semibold text-lg hover:bg-chocolate/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Heart
                    size={20}
                    className={
                      isInWishlist(item.id)
                        ? "fill-red-500 text-red-500"
                        : ""
                    }
                  />
                  {isInWishlist(item.id) ? "Saved for Later" : "Save for Later"}
                </button>

                <div className="flex items-center justify-center gap-3 mt-6">
                  <span className="text-chocolate/60 text-sm font-medium mr-1">Share:</span>
                  {typeof navigator !== "undefined" && "share" in navigator && (
                    <button
                      onClick={handleNativeShare}
                       className="p-2 rounded-full bg-chocolate/5 hover:bg-chocolate/10 text-chocolate dark:text-vanilla transition-colors"
                       aria-label="Share"
                    >
                      <Share2 size={18} />
                    </button>
                  )}
                  <button
                    onClick={handleWhatsAppShare}
                    className="p-2 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-colors"
                    aria-label="Share on WhatsApp"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.479-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  </button>
                  <button
                    onClick={handleXShare}
                    className="p-2 rounded-full bg-[#000000]/5 hover:bg-[#000000]/10 text-[#000000] transition-colors"
                    aria-label="Share on X"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </button>
                  <button
                    onClick={handleCopyLink}
                     className="p-2 rounded-full bg-chocolate/5 hover:bg-chocolate/10 text-chocolate dark:text-vanilla transition-colors"
                     aria-label="Copy link"
                  >
                    <Copy size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1 mt-4 text-chocolate/60 text-sm">
                  <Clock size={16} />
                  Ready in 30-45 minutes
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-chocolate/10">
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div>
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-chocolate dark:text-vanilla">
            Customer Reviews
          </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Stars count={Math.round(averageRating)} />
                    <span className="text-truffle font-bold">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-chocolate/60 text-sm">
                      ({allReviews.length}{" "}
                      {allReviews.length === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                </div>
              </div>

              {allReviews.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {allReviews.map((review, index) => (
                    <ReviewCard key={index} review={review} />
                  ))}
                </div>
              ) : (
                <p className="text-chocolate/60 text-center py-8">
                  No reviews yet. Be the first to review this product!
                </p>
              )}

              <div className="border-t border-chocolate/10 pt-10">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-chocolate dark:text-vanilla mb-6 text-center">
                  Leave a Review
                </h3>
                <form
                  onSubmit={handleReviewSubmit}
                  className="max-w-2xl mx-auto space-y-6"
                >
                  <div>
                    <label className="block text-chocolate dark:text-vanilla font-medium mb-2">
                      Your Name
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate/40"
                      />
                      <input
                        type="text"
                        name="name"
                        value={reviewForm.name}
                        onChange={handleReviewChange}
                        placeholder="John Doe"
                        required
                        className="w-full border border-chocolate/20 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-truffle"
                      />
                    </div>
                    {reviewErrors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {reviewErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-chocolate dark:text-vanilla font-medium mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate/40"
                      />
                      <input
                        type="email"
                        name="email"
                        value={reviewForm.email}
                        onChange={handleReviewChange}
                        placeholder="your@email.com"
                        required
                        className="w-full border border-chocolate/20 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-truffle"
                      />
                    </div>
                    {reviewErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {reviewErrors.email}
                      </p>
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
                          onClick={() =>
                            handleReviewChange({
                              target: {
                                name: "rating",
                                value: star.toString(),
                              },
                            } as any)
                          }
                          className={`text-2xl ${
                            reviewForm.rating >= star
                              ? "text-truffle"
                              : "text-chocolate/20"
                          } hover:text-truffle transition-colors`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-chocolate dark:text-vanilla font-medium mb-2">
                      Photo (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReviewPhoto}
                      className="w-full border border-chocolate/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle text-sm"
                    />
                    {reviewForm.photo && (
                      <img src={reviewForm.photo} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-lg border border-chocolate/20" />
                    )}
                  </div>
                  <div>
                    <label className="block text-chocolate dark:text-vanilla font-medium mb-2">
                      Your Review
                    </label>
                    <div className="relative">
                      <MessageSquare
                        size={18}
                        className="absolute left-3 top-3 text-chocolate/40"
                      />
                      <textarea
                        name="comment"
                        value={reviewForm.comment}
                        onChange={handleReviewChange}
                        rows={4}
                        placeholder="Share your experience with this product..."
                        required
                        className="w-full border border-chocolate/20 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-truffle resize-none"
                      />
                    </div>
                    {reviewErrors.comment && (
                      <p className="text-red-500 text-sm mt-1">
                        {reviewErrors.comment}
                      </p>
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
                      Thank you for your review! It will be reviewed
                      shortly.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </motion.div>

        {recommendations.length > 0 && (
          <div className="mt-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-chocolate dark:text-vanilla mb-8 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendations.map((rec) => (
                <Link href={`/product/${rec.id}`} key={rec.id} className="block">
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="flex flex-col gap-2 overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative bg-vanilla/40 overflow-hidden w-full aspect-square">
                      <Image
                        src={rec.image}
                        alt={rec.title}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full transition-transform duration-500"
                      />
                      {rec.highlight && (
                        <span className="absolute top-2 left-2 bg-truffle text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          BEST VALUE
                        </span>
                      )}
                      <div className="absolute bottom-2 right-2 z-10 text-chocolate dark:text-vanilla font-medium text-xs leading-tight text-center align-middle h-8 flex items-center gap-1 bg-white border border-chocolate/20 rounded-full px-2 py-1">
                        QAR {rec.price}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 p-3">
                      <p className="font-normal text-chocolate dark:text-vanilla line-clamp-1 truncate overflow-hidden text-[0.875rem] leading-[1.25rem] tracking-[-0.006rem]">
                        {rec.title}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-truffle text-[18px] leading-[1.25rem] tracking-[0rem] font-semibold">
                          QAR {rec.price}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
