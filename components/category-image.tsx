"use client";

import Image from "next/image";
import { useState } from "react";

interface CategoryImageProps {
  imageUrl: string;
  altText: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

export function CategoryImage({ 
  imageUrl, 
  altText, 
  className = "", 
  fill = true,
  width,
  height 
}: CategoryImageProps) {
  const [error, setError] = useState(false);
  
  // Use default image if error occurs or no image is provided
  const src = error || !imageUrl ? "/category-images/default.jpg" : imageUrl;
  
  // For local images in the public folder, we'll use regular img tag
  // This helps prevent issues with Next.js Image component on deployment
  if (src.startsWith("/category-images/")) {
    if (fill) {
      return (
        <div className="relative w-full h-full">
          <img
            src={src}
            alt={altText}
            className={`object-cover absolute inset-0 w-full h-full ${className}`}
            onError={() => setError(true)}
          />
        </div>
      );
    }
    
    return (
      <img
        src={src}
        alt={altText}
        className={className}
        width={width}
        height={height}
        onError={() => setError(true)}
      />
    );
  }
  
  // For remote images, we'll still use Next.js Image with optimization
  if (fill) {
    return (
      <Image
        src={src}
        alt={altText}
        fill
        className={`object-cover ${className}`}
        onError={() => setError(true)}
      />
    );
  }
  
  return (
    <Image
      src={src}
      alt={altText}
      width={width || 300}
      height={height || 200}
      className={className}
      onError={() => setError(true)}
    />
  );
} 