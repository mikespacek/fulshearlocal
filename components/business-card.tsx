"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, MapPin, Phone, Globe } from "lucide-react";

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
    <Link href={`/business/${id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all hover:translate-y-[-2px] duration-300">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg truncate">{name}</h3>
              {rating && (
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium text-yellow-700">{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">{category}</div>
            <div className="flex items-start mt-4 text-sm">
              <MapPin className="h-4 w-4 mr-2 shrink-0 mt-0.5 text-gray-500" />
              <span className="line-clamp-2 text-gray-700">{address}</span>
            </div>
            {phoneNumber && (
              <div className="flex items-center mt-3 text-sm">
                <Phone className="h-4 w-4 mr-2 shrink-0 text-gray-500" />
                <span className="text-gray-700">{phoneNumber}</span>
              </div>
            )}
            {website && (
              <div className="flex items-center mt-3 text-sm">
                <Globe className="h-4 w-4 mr-2 shrink-0 text-gray-500" />
                <span className="truncate text-gray-700">{new URL(website).hostname}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="px-6 py-4 border-t bg-gray-50">
          <div className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">View details</div>
        </CardFooter>
      </Card>
    </Link>
  );
} 