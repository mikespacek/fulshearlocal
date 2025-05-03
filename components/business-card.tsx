"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, MapPin, Phone, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface BusinessCardProps {
  id: string;
  name: string;
  address: string;
  rating?: number;
  phoneNumber?: string;
  website?: string;
  category: string;
}

export function BusinessCard({
  id,
  name,
  address,
  rating,
  phoneNumber,
  website,
  category,
}: BusinessCardProps) {
  return (
    <Link href={`/business/${id}`} className="block h-full">
      <motion.div 
        whileHover={{ 
          y: -5,
          transition: { duration: 0.2 }
        }}
        className="h-full"
      >
        <Card className="h-full overflow-hidden border-gray-200 bg-white group transition-all duration-300 hover:shadow-xl relative">
          {/* Top accent bar with subtle gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg sm:text-xl leading-tight text-gray-800 pr-2 group-hover:text-blue-700 transition-colors">{name}</h3>
                {rating && (
                  <div className="flex items-center bg-yellow-50 px-2 sm:px-2.5 py-1 rounded-full">
                    <Star className="h-3.5 sm:h-4 w-3.5 sm:w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-xs sm:text-sm font-medium text-yellow-700">{rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {category}
                </span>
                {website && (
                  <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    Website
                  </span>
                )}
              </div>
              
              <div className="bg-gray-50 p-2.5 sm:p-3 rounded-lg space-y-2.5 sm:space-y-3 border border-gray-100">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 shrink-0 mt-0.5 text-gray-500" />
                  <span className="line-clamp-2 text-gray-700 text-xs sm:text-sm">{address}</span>
                </div>
                
                {phoneNumber && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 shrink-0 text-gray-500" />
                    <span className="text-gray-700 text-xs sm:text-sm">{phoneNumber}</span>
                  </div>
                )}
                
                {website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 shrink-0 text-gray-500" />
                    <span className="truncate text-gray-700 text-xs sm:text-sm">{new URL(website).hostname}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="px-4 sm:px-6 py-3 border-t bg-gray-50 group-hover:bg-blue-50 transition-colors">
            <div className="w-full flex items-center justify-center text-xs sm:text-sm font-medium text-blue-600 group-hover:text-blue-700">
              <span className="touch-manipulation">View details</span>
              <ArrowRight className="ml-1.5 h-3.5 sm:h-4 w-3.5 sm:w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
} 