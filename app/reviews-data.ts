export interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  photo?: string;
}

export const testimonials: Review[] = [
  {
    id: "t1",
    name: "Sarah Al-Khalifa",
    text: "The cozy vibe and the truffles are unmatched. My go-to spot for late-night dessert runs!",
    rating: 5,
    status: "approved",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "t2",
    name: "Ahmed Hassan",
    text: "Best matcha latte in Doha, hands down. The staff is incredibly friendly and the atmosphere is just perfect.",
    rating: 5,
    status: "approved",
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: "t3",
    name: "Emily Watson",
    text: "Happy Truffles feels like home. The breakfast combo is a steal and the coffee is always freshly brewed.",
    rating: 5,
    status: "approved",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];
