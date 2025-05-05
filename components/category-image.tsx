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
  let src = error || !imageUrl ? "/category-images/default.jpg" : imageUrl;
  
  // For local images use simple img tags with proper attributes
  if (src.includes("/category-images/")) {
    // Create image with fixed dimensions if fill is not required
    if (!fill) {
      return (
        <img
          src={src}
          alt={altText}
          className={className}
          width={width || 300}
          height={height || 200}
          onError={() => {
            console.error(`Failed to load image: ${src}`);
            setError(true);
          }}
        />
      );
    }
    
    // For fill mode, we need a container
    return (
      <div className="relative w-full h-full">
        <img
          src={src}
          alt={altText}
          className={`object-cover absolute inset-0 w-full h-full ${className}`}
          onError={() => {
            console.error(`Failed to load image: ${src}`);
            setError(true);
          }}
        />
      </div>
    );
  }
  
  // For remote images, use Next.js Image component
  if (fill) {
    return (
      <Image
        src={src}
        alt={altText}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
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