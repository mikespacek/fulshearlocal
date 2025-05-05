"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, ShoppingBag, MapPin, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { BusinessCard } from "@/components/business-card";
import { BusinessCardSkeleton } from "@/components/business-card-skeleton";
import { Footer } from "@/components/footer";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react";

interface Category {
  _id: Id<"categories">;
  name: string;
}

interface CategoryStyle {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  color: string;
  description: string;
}

// Category information
const categoryInfo: Record<string, CategoryStyle> = {
  "Restaurants": { 
    icon: Utensils, 
    color: "bg-red-400",
    description: "Discover local dining options"
  },
  "Shopping": { 
    icon: ShoppingBag, 
    color: "bg-emerald-400",
    description: "Browse local stores and boutiques"
  },
  "default": { 
    icon: ShoppingBag, 
    color: "bg-gray-300",
    description: "Browse local businesses"
  }
};

// Main categories list
const APPROVED_CATEGORIES = [
  "Restaurants",
  "Shopping",
  "Medical & Dental",
  "Beauty & Wellness",
  "Financial Services",
  "Real Estate",
  "Automotive",
  "Professional Services",
  "Childcare & Education",
  "Religious Organizations",
  "Sports & Fitness",
  "Recreation & Entertainment",
  "Home Services"
];

export default function CategoriesPage() {
  // State management
  const [selectedCategory, setSelectedCategory] = useState<Id<"categories"> | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [hasWebsite, setHasWebsite] = useState(false);
  
  // Data fetching
  const unfilteredCategories = useQuery(api.categories.getAll) as Category[] | undefined;
  const categories = unfilteredCategories?.filter(
    category => APPROVED_CATEGORIES.includes(category.name)
  );
  
  const allBusinesses = useQuery(api.businesses.getAll);
  const categoryBusinesses = useQuery(api.businesses.getByCategory, { 
    categoryId: selectedCategory 
  });
  
  // Use appropriate business list
  const businesses = selectedCategory ? categoryBusinesses : allBusinesses;
  
  // Build category map for lookup
  const categoryMap = new Map();
  if (categories) {
    categories.forEach((category) => {
      categoryMap.set(category._id, category.name);
    });
  }
  
  // Get selected category name
  const selectedCategoryName = selectedCategory ? categoryMap.get(selectedCategory) : "All Categories";
  
  // Get category styling information
  const getCategoryInfo = (categoryName: string) => {
    return categoryInfo[categoryName] || categoryInfo.default;
  };
  
  // Filter businesses
  const filteredBusinesses = businesses ? businesses.filter(business => 
    !hasWebsite || business.website
  ) : null;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="bg-red-500 text-white text-center py-2 px-4">
        New Page - Testing Updates
      </div>
      
      <main className="flex-1 container py-12 px-4 md:px-6">
        {/* Hero */}
        <div className="relative mb-12 rounded-2xl overflow-hidden bg-blue-600">
          <div className="relative z-10 py-16 px-6 md:px-12 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Fulshear&apos;s Best Businesses</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Find and support amazing local businesses in your community
            </p>
            <button
              onClick={() => setSelectedCategory(null)}
              className="bg-white text-blue-600 hover:bg-opacity-90 font-medium py-3 px-8 rounded-full text-sm transition-all duration-300 shadow-lg"
            >
              View All Categories
            </button>
          </div>
        </div>
        
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Business Categories</h2>
          
          {!categories ? (
            // Loading skeletons
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden shadow-md bg-white">
                  <div className="h-36 bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-100 rounded w-full animate-pulse mb-1"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
              {categories.map((category) => {
                const info = getCategoryInfo(category.name);
                const IconComponent = info.icon;
                
                return (
                  <div 
                    key={category._id}
                    className={`cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                      selectedCategory === category._id ? "ring-2 ring-blue-600" : ""
                    }`}
                    onClick={() => setSelectedCategory(category._id)}
                  >
                    <div className={`relative h-36 flex flex-col items-center justify-center p-4 ${info.color}`}>
                      <div className="bg-white/20 p-3 rounded-full mb-2">
                        <IconComponent className="h-9 w-9 text-white" />
                      </div>
                      <div className="uppercase tracking-wide text-xs font-bold text-white">
                        {category.name}
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <h3 className="font-medium text-base">{category.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {info.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Business Listings */}
        <div className="pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategoryName}
              <span className="ml-3 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                {filteredBusinesses ? filteredBusinesses.length : businesses ? businesses.length : 0}
              </span>
              {hasWebsite && (
                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                  Filtered
                </span>
              )}
            </h2>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
          
          {showFilters && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="hasWebsite"
                  checked={hasWebsite}
                  onChange={() => setHasWebsite(!hasWebsite)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasWebsite" className="ml-2 block text-sm text-gray-700">
                  Only show businesses with website
                </label>
                
                <button
                  onClick={() => setHasWebsite(false)}
                  className="ml-auto text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
          
          {!businesses ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <BusinessCardSkeleton key={i} />
              ))}
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">No businesses found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                There are no businesses in this category yet. Check back later or browse other categories.
              </p>
              <button
                onClick={() => setSelectedCategory(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full text-sm font-medium transition-colors"
              >
                Browse all categories
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBusinesses?.map((business) => (
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
      </main>
      
      <Footer />
    </div>
  );
} 