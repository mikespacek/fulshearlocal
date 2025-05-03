"use client";

// Force refresh: timestamp 2024-09-05-12:00
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { CategoryFilter } from "@/components/category-filter";
import { BusinessCard } from "@/components/business-card";
import { BusinessCardSkeleton } from "@/components/business-card-skeleton";

interface Business {
  _id: Id<"businesses">;
  name: string;
  address: string;
  phoneNumber?: string;
  website?: string;
  rating?: number;
  categoryId: Id<"categories">;
}

interface Category {
  _id: Id<"categories">;
  name: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Id<"categories"> | null>(null);

  // Always fetch these queries unconditionally
  const searchResults = useQuery(api.businesses.search, { searchTerm });
  const allBusinesses = useQuery(api.businesses.getAll);
  
  // Use null when no category is selected
  const categoryResults = useQuery(api.businesses.getByCategory, { 
    categoryId: selectedCategory 
  });
  
  // Determine which businesses to show based on filters
  let businesses: Business[] | undefined;
  if (searchTerm && searchResults) {
    businesses = searchResults;
  } else if (selectedCategory && categoryResults) {
    businesses = categoryResults;
  } else {
    businesses = allBusinesses;
  }

  // Fetch categories for our filter
  const categories = useQuery(api.categories.getAll) as Category[] | undefined;

  // Get category name map for display
  const categoryMap = new Map();
  if (categories) {
    categories.forEach((category) => {
      categoryMap.set(category._id, category.name);
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <div className="relative bg-cover bg-center h-[50vh]" style={{ backgroundImage: "url('/hero-background.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white px-4">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
              Find Local Businesses in Fulshear, TX
            </h1>
            <p className="text-xl md:text-2xl text-center mb-8 max-w-3xl mx-auto">
              Discover the best local restaurants, shops, and services in our community
            </p>
            <div className="w-full max-w-md mx-auto">
              <SearchBar 
                onSearch={setSearchTerm} 
                placeholder="Search for restaurants, shops, services..." 
              />
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-12 bg-gray-50 p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Categories</h2>
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              onCategorySelect={setSelectedCategory} 
            />
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">
              {searchTerm ? `Search Results: "${searchTerm}"` : 
               selectedCategory ? `${categoryMap.get(selectedCategory) || "Category"}` : 
               "All Businesses"}
            </h2>
            
            {!businesses ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BusinessCardSkeleton key={i} />
                ))}
              </div>
            ) : businesses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-medium mb-2">No businesses found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or category filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          </div>
        </div>
      </main>
      
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Fulshear Local. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
