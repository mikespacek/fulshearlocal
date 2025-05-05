"use client";

// Force refresh: timestamp 2024-09-05-12:00
import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { CategoryFilter } from "@/components/category-filter";
import { BusinessCard } from "@/components/business-card";
import { BusinessCardSkeleton } from "@/components/business-card-skeleton";
import Link from "next/link";
import DirectCategoryImage from "@/components/direct-category-image";
import { MapPin, Star, TrendingUp, Clock, Award, ArrowRight, CheckCircle, Search, Loader2 } from "lucide-react";

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
}

// List of approved categories - only show these categories
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

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false); // Track if a search has been performed
  const [selectedCategory, setSelectedCategory] = useState<Id<"categories"> | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Always fetch these queries unconditionally
  const searchResults = useQuery(api.businesses.search, { searchTerm: searchQuery });
  const allBusinesses = useQuery(api.businesses.getAll);
  
  // Use null when no category is selected
  const categoryResults = useQuery(api.businesses.getByCategory, { 
    categoryId: selectedCategory 
  });
  
  // Determine which businesses to show based on filters
  let businesses: Business[] | undefined;
  if (searchQuery && searchResults) {
    businesses = searchResults;
  } else if (selectedCategory && categoryResults) {
    businesses = categoryResults;
  } else {
    businesses = allBusinesses;
  }

  // Fetch categories for our filter
  const unfilteredCategories = useQuery(api.categories.getAll) as Category[] | undefined;
  
  // Filter out any categories that aren't in our approved list
  const categories = unfilteredCategories?.filter(
    category => APPROVED_CATEGORIES.includes(category.name)
  );

  // Get category name map for display
  const categoryMap = new Map();
  if (categories) {
    categories.forEach((category) => {
      categoryMap.set(category._id, category.name);
    });
  }

  // Get the selected category name and description
  let selectedCategoryName = "All Businesses";
  let selectedCategoryDescription = "Discover local businesses in Fulshear, TX";
  
  if (selectedCategory && categories) {
    const category = categories.find(c => c._id === selectedCategory);
    if (category) {
      selectedCategoryName = category.name;
      selectedCategoryDescription = category.description || `${category.name} in Fulshear, TX`;
    }
  }

  // Get top-rated businesses
  const topRatedBusinesses = businesses 
    ? [...businesses].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3)
    : undefined;

  // Effect to scroll to search results when they appear
  useEffect(() => {
    if (hasSearched && searchResultsRef.current) {
      // Add a small delay to ensure the results are rendered
      const timer = setTimeout(() => {
        searchResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hasSearched, searchQuery, searchResults]);

  // Handle search input changes
  const handleSearchInputChange = (term: string) => {
    setSearchTerm(term);
  };
  
  // Handle search execution
  const executeSearch = () => {
    setIsSearching(true);
    setHasSearched(true); // Mark that a search has been executed
    
    if (searchTerm.trim()) {
      // If there's a search term, set it as the query
      setSearchQuery(searchTerm.trim());
    } else {
      // If search is empty, show all businesses by clearing the query
      setSearchQuery("");
    }
    
    // Small delay to show the searching state
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setSubscribing(true);
    
    // Here you would typically call an API to save the email
    // For now, we'll just simulate a successful subscription
    setTimeout(() => {
      setSubscribed(true);
      setSubscribing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section with Enhanced Background */}
      <div className="relative bg-cover bg-center h-[50vh] sm:h-[60vh]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-gray-800/70 flex flex-col items-center justify-center">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Find the Best of<br /> 
              <span className="text-yellow-300">Fulshear, Texas</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 mb-6 sm:mb-8 max-w-3xl mx-auto">
              Discover and support amazing local businesses in our community
            </p>
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-lg mx-auto bg-white/10 p-1 rounded-full backdrop-blur-sm">
              <div className="flex">
                <div className="flex-grow">
                  <SearchBar 
                    onSearch={handleSearchInputChange}
                    placeholder="Search for restaurants, shops, services..." 
                    isSearching={isSearching}
                    skipAutoSearch={true}
                  />
                </div>
                <button
                  onClick={executeSearch}
                  disabled={isSearching}
                  className="ml-2 bg-black hover:bg-gray-900 text-white px-4 sm:px-6 rounded-full text-sm font-medium h-10 sm:h-12 transition-colors flex-shrink-0 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <span className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Searching...
                    </span>
                  ) : (
                    <span>Search</span>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 mt-8 sm:mt-12 text-white">
              <div className="flex items-center">
                <MapPin className="h-4 sm:h-5 w-4 sm:w-5 mr-1.5 sm:mr-2 text-yellow-300" />
                <span className="text-xs sm:text-sm md:text-base">100+ Local Businesses</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 sm:h-5 w-4 sm:w-5 mr-1.5 sm:mr-2 text-yellow-300" />
                <span className="text-xs sm:text-sm md:text-base">Verified Reviews</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5 mr-1.5 sm:mr-2 text-yellow-300" />
                <span className="text-xs sm:text-sm md:text-base">Growing Community</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-1 py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Search Results Section - Only show if a search was executed */}
          {hasSearched ? (
            <section ref={searchResultsRef} className="mb-12 sm:mb-16 scroll-mt-16">
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {searchQuery ? `Search Results: "${searchQuery}"` : "All Businesses"}
                </h2>
                <p className="text-gray-600 mt-1">
                  {businesses ? 
                    `Found ${businesses.length} ${businesses.length === 1 ? 'business' : 'businesses'}` :
                    'Searching...'}
                </p>
              </div>
              
              {/* Search results content */}
              {!businesses ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <BusinessCardSkeleton key={i} />
                  ))}
                </div>
              ) : businesses.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <h3 className="text-xl font-medium mb-2">No businesses found</h3>
                  <p className="text-gray-600">
                    {searchQuery ? 'Try a different search term' : 'No businesses available at this time'}
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
            </section>
          ) : (
            <>
              {/* Only show categories if no search has been performed */}
              <section className="mb-12 sm:mb-16">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold">Explore Categories</h2>
                </div>
                
                {/* Categories content */}
                {!categories ? (
                  // Loading state for categories
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse relative overflow-hidden shadow-sm"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    {categories.slice(0, 12).map((category) => {
                      // Use real photographs for each category (from category-images folder)
                      const categoryDescription = category.description || `Find local ${category.name} in Fulshear`;
                      
                      return (
                        <Link 
                          href={`/categories/${category._id}`}
                          key={category._id}
                          className="group aspect-square rounded-xl overflow-hidden shadow-sm relative transition-all duration-300 hover:shadow-md"
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                          <div className="relative h-full w-full">
                            <DirectCategoryImage
                              category={category.name}
                              className="group-hover:scale-105 transition-transform duration-500"
                              fill
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-20 text-white">
                            <h3 className="font-bold text-sm sm:text-base mb-1">{category.name}</h3>
                            <p className="text-xs text-gray-200 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {categoryDescription}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </section>
              
              {/* Featured Section - Only show on homepage */}
              {!selectedCategory && topRatedBusinesses && topRatedBusinesses.length > 0 && (
                <section className="mb-10 sm:mb-12 md:mb-16">
                  <div className="mb-5 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">Top Rated in Fulshear</h2>
                    <p className="text-sm sm:text-base text-gray-600">Highly rated businesses in our community</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {topRatedBusinesses.map((business) => (
                      <div key={business._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="bg-blue-50 p-3 sm:p-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <Award className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600 mr-2" />
                            <h3 className="font-semibold text-sm sm:text-base">{business.name}</h3>
                          </div>
                          <div className="flex items-center bg-yellow-400 px-2 py-1 rounded text-white">
                            <Star className="h-3.5 sm:h-4 w-3.5 sm:w-4 fill-current mr-1" />
                            <span className="text-xs sm:text-sm font-bold">{business.rating?.toFixed(1) || "N/A"}</span>
                          </div>
                        </div>
                        <div className="p-3 sm:p-4">
                          <div className="flex items-start mb-2">
                            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-700">{business.address}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-blue-600 font-medium mb-3">
                            {categoryMap.get(business.categoryId) || "Unknown"}
                          </p>
                          <Link 
                            href={`/business/${business._id}`}
                            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                          >
                            View Details
                            <ArrowRight className="h-3 sm:h-3.5 w-3 sm:w-3.5 ml-1" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
          
          {/* Community Callout - Show on all pages */}
          <section className="mb-10 sm:mb-12 md:mb-16 bg-gradient-to-r from-gray-900 to-black rounded-xl overflow-hidden text-white">
            <div className="p-6 sm:p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">Stay Connected with Fulshear</h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-xl">
                  Subscribe to our newsletter for local events, new business openings, and community updates. Be the first to know what&apos;s happening in Fulshear!
                </p>
              </div>
              <div className="flex-shrink-0 w-full md:w-auto">
                {subscribed ? (
                  <div className="flex items-center text-center md:text-left space-x-2 bg-gray-800/50 rounded-lg p-4">
                    <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
                    <p className="text-sm text-gray-200">
                      Thanks for subscribing! You'll receive our next update.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="px-4 py-2.5 rounded-full text-xs sm:text-sm text-gray-200 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-800 border border-gray-700"
                      aria-label="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button 
                      type="submit" 
                      className="px-6 py-2.5 bg-black hover:bg-gray-900 text-white rounded-full text-xs sm:text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      disabled={subscribing}
                    >
                      {subscribing ? "Subscribing..." : "Subscribe"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="border-t py-8 sm:py-10 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h3 className="font-bold text-base sm:text-lg mb-3">Fulshear Local</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 max-w-md">
              Connecting the Fulshear community with local businesses and services.
            </p>
            <a 
              href="mailto:hello@fulshearlocal.com" 
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors mb-6"
            >
              hello@fulshearlocal.com
            </a>
            
            <div className="border-t w-full max-w-xl pt-6 flex flex-col sm:flex-row justify-center items-center">
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-0">
                © {new Date().getFullYear()} Fulshear Local. All rights reserved.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l sm:border-gray-300">
                Made with <span role="img" aria-label="love">❤️</span> by <span className="font-black">CALLIE BRAND</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
