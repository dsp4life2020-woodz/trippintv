import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = [
  { key: "all", label: "All", emoji: "🔥" },
  { key: "road_rage", label: "Road Rage", emoji: "🚗" },
  { key: "public_freakout", label: "Public Freakout", emoji: "😱" },
  { key: "customer_service", label: "Customer Service", emoji: "🛒" },
  { key: "neighbor_drama", label: "Neighbor Drama", emoji: "🏠" },
  { key: "family_drama", label: "Family Drama", emoji: "👨‍👩‍👧‍👦" },
  { key: "workplace_chaos", label: "Workplace", emoji: "💼" },
  { key: "random_meltdown", label: "Random Meltdown", emoji: "🤯" },
  { key: "other", label: "Other", emoji: "❓" }
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Browse by Category</h3>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Button
            key={category.key}
            variant={selectedCategory === category.key ? "default" : "outline"}
            onClick={() => onCategoryChange(category.key)}
            className={`flex items-center gap-2 rounded-full transition-all duration-200 ${
              selectedCategory === category.key
                ? "bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white shadow-lg transform scale-105"
                : "hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
            }`}
          >
            <span className="text-lg">{category.emoji}</span>
            {category.label}
            {selectedCategory === category.key && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Active
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
