"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BusinessCard } from "@/components/business-card";
import { BusinessCardSkeleton } from "@/components/business-card-skeleton";
import { Id } from "@/convex/_generated/dataModel";

interface Category {
  _id: Id<"categories">;
  name: string;
}

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Id<"categories"> | null>(null);
  
  // Fetch categories
  const categories = useQuery(api.categories.getAll) as Category[] | undefined;
  
  // Always fetch both queries without conditionals
  const allBusinesses = useQuery(api.businesses.getAll);
  
  // Pass null when no category is selected
  const categoryBusinesses = useQuery(api.businesses.getByCategory, { 
    categoryId: selectedCategory 
  });
  
  // Use the appropriate business list
  const businesses = selectedCategory ? categoryBusinesses : allBusinesses;
  
  // Get category name map
  const categoryMap = new Map();
  if (categories) {
    categories.forEach((category) => {
      categoryMap.set(category._id, category.name);
    });
  }
  
  const selectedCategoryName = selectedCategory ? categoryMap.get(selectedCategory) : "All Categories";
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
          Business Categories
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Category cards */}
          {!categories ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              {/* All categories card */}
              <Card 
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  !selectedCategory ? "border-blue-500 border-2" : ""
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">All Categories</h3>
                  <p className="text-sm text-muted-foreground">
                    View all businesses
                  </p>
                </CardContent>
              </Card>
            
              {/* Individual category cards */}
              {categories.map((category) => (
                <Card 
                  key={category._id}
                  className={`hover:shadow-md transition-shadow cursor-pointer ${
                    selectedCategory === category._id ? "border-blue-500 border-2" : ""
                  }`}
                  onClick={() => setSelectedCategory(category._id)}
                >
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      View businesses in this category
                    </p>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
        
        <h2 className="text-2xl font-bold mb-6">
          {selectedCategoryName}
        </h2>
        
        {!businesses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BusinessCardSkeleton key={i} />
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No businesses found</h3>
            <p className="text-muted-foreground">
              There are no businesses in this category yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard
                key={business._id}
                id={business._id}
                name={business.name}
                address={business.address}
                rating={business.rating}
                phoneNumber={business.phoneNumber}
                website={business.website}
                category={categoryMap.get(business.categoryId) || "Unknown"}
              />
            ))}
          </div>
        )}
      </main>
      
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Fulshear Local. All rights reserved.</p>
      </footer>
    </div>
  );
} 