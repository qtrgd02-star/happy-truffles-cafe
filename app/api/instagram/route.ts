import { NextResponse } from "next/server";

const mockPosts: any[] = [
  {
    id: "1",
    imageUrl: "/gallery-1.jpg",
    caption: "Fresh truffles made with love! 🍫",
    likes: 245,
    link: "https://www.instagram.com/happytrufflescafe",
  },
  {
    id: "2",
    imageUrl: "/gallery-2.jpg",
    caption: "Coffee and truffles - perfect match! ☕",
    likes: 189,
    link: "https://www.instagram.com/happytrufflescafe",
  },
  {
    id: "3",
    imageUrl: "/gallery-3.jpg",
    caption: "New summer specials available now! 🌞",
    likes: 312,
    link: "https://www.instagram.com/happytrufflescafe",
  },
  {
    id: "4",
    imageUrl: "/gallery-4.jpg",
    caption: "Thank you for your support! 💕",
    likes: 156,
    link: "https://www.instagram.com/happytrufflescafe",
  },
  {
    id: "5",
    imageUrl: "/gallery-5.jpg",
    caption: "Weekend special offer! 🎉",
    likes: 278,
    link: "https://www.instagram.com/happytrufflescafe",
  },
  {
    id: "6",
    imageUrl: "/gallery-6.jpg",
    caption: "Made with the finest ingredients ✨",
    likes: 198,
    link: "https://www.instagram.com/happytrufflescafe",
  },
];

export async function GET() {
  return NextResponse.json(mockPosts);
}
