"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Review } from "@/app/reviews-data";

interface ReviewsContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, "name" | "id" | "status" | "createdAt"> & { name?: string }) => Promise<void>;
  clearReviews: () => void;
  syncReviews: () => Promise<void>;
  approveReview: (id: string) => Promise<void>;
  rejectReview: (id: string) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  refreshReviews: () => Promise<void>;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

const REVIEWS_KEY = "reviews";

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(REVIEWS_KEY);
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse reviews from localStorage", e);
        localStorage.removeItem(REVIEWS_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const syncToApi = useCallback(async () => {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync", reviews }),
      });
      if (!res.ok) throw new Error("Failed to sync reviews");
    } catch (e) {
      console.error("Review sync failed:", e);
    }
  }, [reviews]);

  const refreshReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(data);
    } catch (e) {
      console.error("Failed to refresh reviews:", e);
    }
  }, []);

  const addReview = async (review: Omit<Review, "name" | "id" | "status" | "createdAt"> & { name?: string }) => {
    const newReview: Review = {
      id: `review_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name: review.name || "Anonymous",
      text: review.text,
      rating: review.rating,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", ...newReview }),
      });
    } catch (e) {
      console.error("Failed to add review:", e);
    }
  };

  const approveReview = async (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", id }),
      });
    } catch (e) {
      console.error("Failed to approve review:", e);
    }
  };

  const rejectReview = async (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", id }),
      });
    } catch (e) {
      console.error("Failed to reject review:", e);
    }
  };

  const deleteReview = async (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
    } catch (e) {
      console.error("Failed to delete review:", e);
    }
  };

  const clearReviews = () => setReviews([]);

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, clearReviews, syncReviews: syncToApi, approveReview, rejectReview, deleteReview, refreshReviews }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error("useReviews must be used within ReviewsProvider");
  return context;
}
