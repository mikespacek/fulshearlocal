"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { BusinessCard } from "@/components/business-card";
import { BusinessCardSkeleton } from "@/components/business-card-skeleton";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { use } from "react";
import DirectCategoryImage from "@/components/direct-category-image";
import { Footer } from "@/components/footer";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

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
  imageUrl?: string;
  description?: string;
  icon?: string;
}

type PageParams = { id: string };

// Add the approved categories list
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

// Sort options
const SORT_OPTIONS = [
  { value: "nameAsc", label: "Name (A-Z)" },
  { value: "nameDesc", label: "Name (Z-A)" },
  { value: "ratingDesc", label: "Rating (High to Low)" },
  { value: "ratingAsc", label: "Rating (Low to High)" }
];

// Rating options
const RATING_OPTIONS = [
  { value: 0, label: "Any rating" },
  { value: 3, label: "3+ stars" },
  { value: 4, label: "4+ stars" },
  { value: 4.5, label: "4.5+ stars" }
];

export default function CategoryPage({ params }: { params: PageParams }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState("nameAsc");
  const [minRating, setMinRating] = useState(0);
  const [hasWebsite, setHasWebsite] = useState(false);
  
  // Use React.use to unwrap params with proper typing
  const resolvedParams = use(params as any) as PageParams;
  const categoryId = resolvedParams.id as Id<"categories">;

  // Fetch businesses for this category
  const businesses = useQuery(api.businesses.getByCategory, { 
    categoryId: categoryId 
  }) as Business[] | undefined;

  // Fetch the category details
  const unfilteredCategories = useQuery(api.categories.getAll) as Category[] | undefined;
  // Filter out any categories that aren't in our approved list
  const categories = unfilteredCategories?.filter(
    category => APPROVED_CATEGORIES.includes(category.name)
  );
  const category = categories?.find(c => c._id === categoryId);

  // Filter businesses by search term and other filters
  const filteredBusinesses = businesses ? businesses
    .filter(business => {
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!business.name.toLowerCase().includes(searchLower) &&
            !business.address.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      // Apply website filter
      if (hasWebsite && !business.website) {
        return false;
      }
      
      // Apply rating filter
      if (minRating > 0 && (!business.rating || business.rating < minRating)) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
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
    }) : undefined;

  // Check if any filter is active
  const isAnyFilterActive = hasWebsite || minRating > 0 || searchTerm.trim() !== '';

  // Reset all filters
  const resetFilters = () => {
    setSortOrder("nameAsc");
    setMinRating(0);
    setHasWebsite(false);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {category && (
        <BreadcrumbStructuredData
          items={[
            {
              name: "Home",
              item: "https://fulshearlocal.com/"
            },
            {
              name: category.name,
              item: `https://fulshearlocal.com/categories/${categoryId}`
            }
          ]}
        />
      )}
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <Link href="/" className="flex items-center text-sm mb-8 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to all categories
          </Link>
          
          {/* Category Header */}
          <div className="mb-12">
            {category ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                  <DirectCategoryImage
                    category={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-3">
                  <h1 className="text-3xl font-bold mb-3">{category?.name || "Loading..."}</h1>
                  <p className="text-muted-foreground text-lg mb-6">
                    {category?.description || `Browse all ${category?.name} in Fulshear, TX`}
                  </p>
                  <div className="w-full max-w-md">
                    <SearchBar 
                      onSearch={setSearchTerm} 
                      placeholder={`Search ${category?.name || 'businesses'}...`} 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            )}
          </div>
          
          {/* Businesses Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  {searchTerm ? `Search Results: "${searchTerm}"` : `All ${category?.name || 'Businesses'}`}
                  <span className="ml-3 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                    {filteredBusinesses ? filteredBusinesses.length : businesses ? businesses.length : 0}
                  </span>
                  {isAnyFilterActive && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                      Filtered
                    </span>
                  )}
                </h2>
                <p className="text-muted-foreground">
                  {filteredBusinesses ? 
                    `Showing ${filteredBusinesses.length} ${filteredBusinesses.length === 1 ? 'business' : 'businesses'}` : 
                    'Loading businesses...'}
                </p>
              </div>

              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  showFilters ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filter Options {isAnyFilterActive ? "(Active)" : ""}
              </button>
            </div>

            {/* Filter options */}
            {showFilters && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
                <h3 className="font-medium text-base mb-3">Filter & Sort Options</h3>
                
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
                        checked={hasWebsite}
                        onChange={() => setHasWebsite(!hasWebsite)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="hasWebsite" className="ml-2 block text-sm text-gray-700">
                        Has website
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            )}
            
            {!filteredBusinesses ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BusinessCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-medium mb-2">No businesses found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 
                    'Try adjusting your search term or filters' : 
                    `There are no ${category?.name} businesses in our directory yet`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBusinesses.map((business) => (
                  <BusinessCard
                    key={business._id}
                    id={business._id}
                    name={business.name}
                    address={business.address}
                    rating={business.rating}
                    phoneNumber={business.phoneNumber}
                    website={business.website}
                    category={category?.name || "Unknown"}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 