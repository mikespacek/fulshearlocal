"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";

interface Category {
  _id: Id<"categories">;
  name: string;
  icon?: string;
}

interface CategoryFilterProps {
  selectedCategory: Id<"categories"> | null;
  onCategorySelect: (categoryId: Id<"categories"> | null) => void;
}

export function CategoryFilter({ selectedCategory, onCategorySelect }: CategoryFilterProps) {
  const categories = useQuery(api.categories.getAll) as Category[] | undefined;

  if (!categories) {
    return (
      <div className="flex overflow-x-auto pb-3 gap-3 no-scrollbar">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-24 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto pb-3 gap-3 no-scrollbar">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onCategorySelect(null)}
        className="rounded-full flex-shrink-0 px-5"
        size="sm"
      >
        All
      </Button>
      {categories.map((category: Category) => (
        <Button
          key={category._id}
          variant={selectedCategory === category._id ? "default" : "outline"}
          onClick={() => onCategorySelect(category._id)}
          className="rounded-full flex-shrink-0 px-5"
          size="sm"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
} 