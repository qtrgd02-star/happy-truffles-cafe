"use client";
import { useState } from "react";

const tourImages = [
  { id: 1, src: "/hero.jpg", title: "Entrance", description: "Welcome to Happy Truffles Cafe" },
  { id: 2, src: "/hero.jpg", title: "Main Seating Area", description: "Cozy seating for all occasions" },
  { id: 3, src: "/hero.jpg", title: "Counter", description: "Where the magic happens" },
  { id: 4, src: "/hero.jpg", title: "Outdoor Patio", description: "Enjoy fresh air with your coffee" },
];

export default function VirtualTour() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % tourImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + tourImages.length) % tourImages.length);

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center" onClick={() => setIsFullscreen(false)}>
        <div className="relative w-full h-full max-w-5xl max-h-screen p-8 flex flex-col items-center justify-center">
          <img src={tourImages[currentImage].src} alt={tourImages[currentImage].title} className="max-w-full max-h-full object-contain rounded-lg" />
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-white text-xl font-playfair">{tourImages[currentImage].title}</p>
            <p className="text-white/70">{tourImages[currentImage].description}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 backdrop-blur-sm">&lt;</button>
          <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 backdrop-blur-sm">&gt;</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="relative">
        <img src={tourImages[currentImage].src} alt={tourImages[currentImage].title} className="w-full h-96 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6">
            <p className="text-white text-2xl font-playfair">{tourImages[currentImage].title}</p>
            <p className="text-white/80">{tourImages[currentImage].description}</p>
          </div>
        </div>
        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm">&lt;</button>
        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm">&gt;</button>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex gap-2">
          {tourImages.map((img, idx) => (
            <button key={img.id} onClick={() => setCurrentImage(idx)} className={`w-3 h-3 rounded-full transition-colors ${idx === currentImage ? "bg-truffle" : "bg-chocolate/20"}`} />
          ))}
        </div>
        <button onClick={() => setIsFullscreen(true)} className="text-truffle text-sm font-medium hover:text-chocolate">Fullscreen</button>
      </div>
    </div>
  );
}
