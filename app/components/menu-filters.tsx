"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface FilterOptions {
  search: string;
  category: string;
  priceRange: [number, number];
  dietary: string[];
  spicyLevel: number[];
  inStockOnly: boolean;
  sortBy: "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";
}

interface MenuFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
}

export default function MenuFilters({ filters, onFilterChange, categories }: MenuFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (updates: Partial<FilterOptions>) => {
    onFilterChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      category: "All",
      priceRange: [0, 100],
      dietary: [],
      spicyLevel: [],
      inStockOnly: false,
      sortBy: "default",
    });
  };

  const hasActiveFilters = filters.category !== "All" || filters.dietary.length > 0 || filters.spicyLevel.length > 0 || filters.inStockOnly || filters.sortBy !== "default";

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate/40" size={20} />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter({ search: e.target.value })}
            placeholder="Search menu..."
            className="w-full pl-10 pr-4 py-3 border border-chocolate/20 rounded-full focus:outline-none focus:ring-2 focus:ring-truffle"
          />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={"p-3 rounded-full border transition-colors " + (hasActiveFilters ? "bg-truffle text-white border-truffle" : "border-chocolate/20 hover:border-truffle")}
        >
          <SlidersHorizontal size={20} />
        </button>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="p-3 text-chocolate/60 hover:text-chocolate">
            <X size={20} />
          </button>
        )}
      </div>

      {isOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg mb-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-chocolate mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => updateFilter({ category: e.target.value })}
                className="w-full border border-chocolate/20 rounded-lg px-3 py-2"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-chocolate mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter({ sortBy: e.target.value as FilterOptions["sortBy"] })}
                className="w-full border border-chocolate/20 rounded-lg px-3 py-2"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-chocolate mb-2">Availability</label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => updateFilter({ inStockOnly: e.target.checked })}
                  className="rounded text-truffle"
                />
                <span className="text-sm">In stock only</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-chocolate mb-2">Dietary</label>
              <div className="space-y-2">
                {["vegetarian", "vegan", "gluten-free", "halal"].map((diet) => (
                  <label key={diet} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.dietary.includes(diet)}
                      onChange={(e) => {
                        const newDietary = e.target.checked
                          ? [...filters.dietary, diet]
                          : filters.dietary.filter((d) => d !== diet);
                        updateFilter({ dietary: newDietary });
                      }}
                      className="rounded text-truffle"
                    />
                    <span className="text-sm capitalize">{diet}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-chocolate mb-2">Spicy Level</label>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      const newLevels = filters.spicyLevel.includes(level)
                        ? filters.spicyLevel.filter((l) => l !== level)
                        : [...filters.spicyLevel, level];
                      updateFilter({ spicyLevel: newLevels });
                    }}
                    className={"w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-colors " + (filters.spicyLevel.includes(level) ? "bg-red-500 text-white border-red-500" : "border-chocolate/20 hover:border-red-500")}
                  >
                    {"🌶".repeat(level + 1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
