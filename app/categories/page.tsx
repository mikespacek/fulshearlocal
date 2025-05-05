"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, ShoppingBag, MapPin, Filter, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BusinessCard } from "@/components/business-card";
import { BusinessCardSkeleton } from "@/components/business-card-skeleton";
import { motion } from "framer-motion";
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { LucideProps } from 'lucide-react';
import { Footer } from "@/components/footer";

interface Category {
  _id: Id<"categories">;
  name: string;
}

// Define interface for category info
interface CategoryInfo {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  color: string;
  textColor: string;
  description: string;
  imageUrl: string;
}

// Category icon and color mapping with descriptions
const categoryInfo: Record<string, CategoryInfo> = {
  "Restaurants": { 
    icon: Utensils, 
    color: "bg-red-400", 
    textColor: "text-white",
    description: "Discover local dining options from casual to upscale",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800"
  },
  "Shopping": { 
    icon: ShoppingBag, 
    color: "bg-emerald-400", 
    textColor: "text-white",
    description: "Browse local stores and boutiques for all your needs",
    imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800"
  },
  // Default fallback
  "default": { 
    icon: ShoppingBag, 
    color: "bg-gray-300", 
    textColor: "text-gray-800",
    description: "Browse local businesses",
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800"
  }
};

// At the top of the file, add the approved categories list
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

// Sorting options for businesses
const SORT_OPTIONS = [
  { value: "nameAsc", label: "Name (A-Z)" },
  { value: "nameDesc", label: "Name (Z-A)" },
  { value: "ratingDesc", label: "Rating (High to Low)" },
  { value: "ratingAsc", label: "Rating (Low to High)" }
];

// Rating options for filtering
const RATING_OPTIONS = [
  { value: 0, label: "Any rating" },
  { value: 3, label: "3+ stars" },
  { value: 4, label: "4+ stars" },
  { value: 4.5, label: "4.5+ stars" }
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Id<"categories"> | null>(null);
  const [mounted, setMounted] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [sortOrder, setSortOrder] = useState("nameAsc");
  const [filterWithWebsite, setFilterWithWebsite] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Handle initial animation
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Reset all filters to default values
  const resetFilters = () => {
    setSortOrder("nameAsc");
    setFilterWithWebsite(false);
    setMinRating(0);
    setSearchQuery("");
  };
  
  // Fetch categories
  const unfilteredCategories = useQuery(api.categories.getAll) as Category[] | undefined;
  
  // Filter out any categories that aren't in our approved list
  const categories = unfilteredCategories?.filter(
    category => APPROVED_CATEGORIES.includes(category.name)
  );
  
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
  
  // Get icon and color for a category
  const getCategoryInfo = (categoryName: string) => {
    return categoryInfo[categoryName] || categoryInfo.default;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Filter and sort businesses
  const filteredAndSortedBusinesses = businesses ? [...businesses]
    // Apply website filter if active
    .filter(business => !filterWithWebsite || business.website)
    // Apply minimum rating filter
    .filter(business => !minRating || (business.rating && business.rating >= minRating))
    // Apply search filter
    .filter(business => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        business.name.toLowerCase().includes(query) ||
        (business.address && business.address.toLowerCase().includes(query))
      );
    })
    // Apply sorting
    .sort((a, b) => {
      switch (sortOrder) {
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        case "ratingDesc":
          return (b.rating || 0) - (a.rating || 0);
        case "ratingAsc":
          return (a.rating || 0) - (b.rating || 0);
        default:
          return 0;
      }
    }) : null;
  
  // Check if any filter is active
  const isAnyFilterActive = filterWithWebsite || minRating > 0 || searchQuery.trim() !== '';
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container py-12 px-4 md:px-6">
        {/* Hero Header */}
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
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Business Categories 
            <span className="ml-3 text-sm bg-green-500 text-white px-3 py-1 rounded-full font-medium">
              Updated
            </span>
          </h2>
          
          {/* Category Grid */}
          {!categories ? (
            // Loading skeletons
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-16">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden shadow-md bg-white">
                  <div className="h-36 bg-gray-200 animate-pulse relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-100 rounded w-full animate-pulse mb-1"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate={mounted ? "visible" : "hidden"}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-16"
            >
              {categories.map((category) => {
                const info = getCategoryInfo(category.name);
                const IconComponent = info.icon;
                
                return (
                  <motion.div key={category._id} variants={itemVariants}>
                    <div 
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
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Selected Category Business Listings */}
        <div className="pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategoryName}
              <span className="ml-3 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                {filteredAndSortedBusinesses ? filteredAndSortedBusinesses.length : businesses ? businesses.length : 0}
              </span>
              {isAnyFilterActive && (
                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                  Filtered
                </span>
              )}
            </h2>
            
            {/* Filter toggle button */}
            <button 
              onClick={() => setFilterActive(!filterActive)}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters {isAnyFilterActive ? "(Active)" : ""}
            </button>
          </div>
          
          {/* Filter options */}
          {filterActive && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">Search businesses</label>
                <button
                  onClick={resetFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear filters
                </button>
              </div>
              
              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or address..."
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                  <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select 
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {RATING_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasWebsite"
                      checked={filterWithWebsite}
                      onChange={() => setFilterWithWebsite(!filterWithWebsite)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hasWebsite" className="ml-2 block text-sm text-gray-700">
                      Has website
                    </label>
                  </div>
                </div>
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
            <div className="text-center py-16 bg-white rounded-xl shadow-sm relative overflow-hidden">
              <div className="relative z-10">
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
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredAndSortedBusinesses?.map((business) => (
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
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 