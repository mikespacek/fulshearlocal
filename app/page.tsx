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
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-lg mx-auto bg-white/10 p-1 rounded-xl backdrop-blur-sm">
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
                  className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 rounded-full text-sm font-medium h-10 sm:h-12 transition-colors flex-shrink-0 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 mb-6 sm:mb-8">
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Fulshear Local</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Connecting the Fulshear community with local businesses and services.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Quick Links</h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link href="/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Browse Categories
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Add Your Business
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Contact</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                Questions or feedback? Reach out to us.
              </p>
              <a 
                href="mailto:info@fulshearlocal.com" 
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                info@fulshearlocal.com
              </a>
            </div>
          </div>
          <div className="border-t pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0">
              © {new Date().getFullYear()} Fulshear Local. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
