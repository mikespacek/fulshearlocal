"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Category {
  _id: Id<"categories">;
  name: string;
  icon?: string;
  imageUrl?: string;
  description?: string;
  order?: number;
}

interface CategoryFilterProps {
  selectedCategory: Id<"categories"> | null;
  onCategorySelect: (categoryId: Id<"categories"> | null) => void;
}

export function CategoryFilter({ selectedCategory, onCategorySelect }: CategoryFilterProps) {
  const categories = useQuery(api.categories.getAll) as Category[] | undefined;

  if (!categories) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <div key={i} className="h-32 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  // Sort categories by order if available
  const sortedCategories = [...categories].sort((a, b) => {
    // If both have order, sort by order
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    // If only one has order, put the one with order first
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    // Otherwise sort by name
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <div className="flex justify-start mb-4">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => onCategorySelect(null)}
          className="rounded-full px-5"
          size="sm"
        >
          View All Categories
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sortedCategories.map((category: Category) => (
          <Card 
            key={category._id}
            className={`cursor-pointer transition-all hover:scale-105 ${
              selectedCategory === category._id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onCategorySelect(category._id)}
          >
            <div className="relative h-24 w-full overflow-hidden rounded-t-lg">
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-24 w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">{category.icon || "📷"}</span>
                </div>
              )}
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm text-center">{category.name}</h3>
              {category.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{category.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 