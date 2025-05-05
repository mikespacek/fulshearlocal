"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2 } from "lucide-react";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  isSearching?: boolean;
  skipAutoSearch?: boolean;
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Search businesses...", 
  isSearching = false,
  skipAutoSearch = false
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search input - only if skipAutoSearch is false
  useEffect(() => {
    if (skipAutoSearch) return;
    
    const timeoutId = setTimeout(() => {
      // Always call onSearch with the current term (empty or not)
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch, skipAutoSearch]);

  // Clear search
  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    // If skipAutoSearch is true, we still want to update the parent component
    // with the current input value, but without triggering a search
    if (skipAutoSearch) {
      onSearch(newValue);
    }
  };

  return (
    <div className="relative w-full max-w-full sm:max-w-md mx-auto">
      {isSearching ? (
        <Loader2 className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-blue-500 animate-spin z-10" />
      ) : (
        <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-500 z-10" />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        className={`w-full pl-8 sm:pl-10 pr-10 sm:pr-12 h-10 sm:h-12 bg-white text-black shadow-lg rounded-full border-none text-xs sm:text-sm ${isSearching ? 'border-blue-400 ring-2 ring-blue-100' : ''}`}
      />
      {searchTerm && (
        <button 
          onClick={handleClear}
          className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5 text-gray-700" />
        </button>
      )}
    </div>
  );
} 