"use client";
import { useState } from "react";
import { useSeasonalMenu } from "@/app/seasonal-menu-context";
import { motion } from "framer-motion";
import { Leaf, Sun, Snowflake, Flower2 } from "lucide-react";

const seasons = [
  { id: "all", label: "All Year", icon: null },
  { id: "spring", label: "Spring", icon: Flower2 },
  { id: "summer", label: "Summer", icon: Sun },
  { id: "autumn", label: "Autumn", icon: Leaf },
  { id: "winter", label: "Winter", icon: Snowflake },
];

export default function SeasonalMenuPage() {
  const { seasonalItems, currentSeason, setCurrentSeason, toggleAvailability } = useSeasonalMenu();
  const [newItem, setNewItem] = useState({ title: "", price: "", image: "/hero.jpg", season: "all" as const, description: "" });
  const [showForm, setShowForm] = useState(false);

  const filtered = currentSeason === "all" ? seasonalItems : seasonalItems.filter((item) => item.season === currentSeason || item.season === "all");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      id: Date.now(),
      title: newItem.title,
      price: parseFloat(newItem.price),
      image: newItem.image,
      season: newItem.season,
      description: newItem.description,
      available: true,
    };
    seasonalItems.push(item);
    toggleAvailability(item.id);
    setNewItem({ title: "", price: "", image: "/hero.jpg", season: "all", description: "" });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Leaf className="text-truffle mx-auto mb-2" size={40} />
            <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">Seasonal Menu</h1>
            <p className="text-chocolate/60">Discover our seasonal specialties</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {seasons.map((season) => (
              <button key={season.id} onClick={() => setCurrentSeason(season.id)} className={`px-4 py-2 rounded-full font-medium transition-colors ${currentSeason === season.id ? "bg-truffle text-white" : "bg-vanilla/20 text-chocolate hover:bg-vanilla/40"}`}>
                {season.label}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="bg-vanilla/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-chocolate">{item.title}</p>
                  <p className="text-sm text-chocolate/60">{item.description}</p>
                  <p className="text-truffle font-bold">QAR {item.price.toFixed(2)}</p>
                </div>
                <button onClick={() => toggleAvailability(item.id)} className={`px-3 py-1 rounded-full text-xs font-medium ${item.available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                  {item.available ? "Available" : "Hidden"}
                </button>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <p className="text-chocolate/60 text-center py-8">No seasonal items for this season</p>}
        </motion.div>
      </div>
    </div>
  );
}
