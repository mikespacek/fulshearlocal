"use client";

import React, { useState } from "react";

interface DirectCategoryImageProps {
  category: string;
  className?: string;
  style?: React.CSSProperties;
  fill?: boolean;
}

// Map of category names to hardcoded image URLs (as a last resort fallback)
const FALLBACK_IMAGES: Record<string, string> = {
  "Restaurants": "https://fulshearlocal.vercel.app/category-images/restaurants.jpg",
  "Shopping": "https://fulshearlocal.vercel.app/category-images/shopping.jpg",
  "Medical & Dental": "https://fulshearlocal.vercel.app/category-images/medical.jpg",
  "Beauty & Wellness": "https://fulshearlocal.vercel.app/category-images/beauty.jpg",
  "Financial Services": "https://fulshearlocal.vercel.app/category-images/financial.jpg",
  "Real Estate": "https://fulshearlocal.vercel.app/category-images/real-estate.jpg",
  "Automotive": "https://fulshearlocal.vercel.app/category-images/automotive.jpg",
  "Professional Services": "https://fulshearlocal.vercel.app/category-images/professional.jpg",
  "Childcare & Education": "https://fulshearlocal.vercel.app/category-images/education.jpg",
  "Religious Organizations": "https://fulshearlocal.vercel.app/category-images/religious.jpg",
  "Sports & Fitness": "https://fulshearlocal.vercel.app/category-images/fitness.jpg",
  "Recreation & Entertainment": "https://fulshearlocal.vercel.app/category-images/entertainment.jpg",
  "Home Services": "https://fulshearlocal.vercel.app/category-images/home-services.jpg",
  // Default fallback for any other category
  "default": "https://fulshearlocal.vercel.app/category-images/default.jpg"
};

export default function DirectCategoryImage({ 
  category, 
  className = "", 
  style = {},
  fill = false
}: DirectCategoryImageProps) {
  const [imgError, setImgError] = useState(false);
  
  // Get the fallback image URL from our hardcoded map
  const fallbackImg = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.default;
  
  // Apply fill styles via className if needed
  const combinedClassName = fill 
    ? `absolute inset-0 w-full h-full object-cover ${className}` 
    : `object-cover ${className}`;
  
  return (
    <img 
      src={fallbackImg}
      alt={category || "Category"} 
      className={combinedClassName}
      style={style} 
      onError={() => setImgError(true)}
    />
  );
} 