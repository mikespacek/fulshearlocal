"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BusinessCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden border-gray-200 bg-white relative">
      {/* Top accent bar with subtle gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400/30 to-indigo-400/30"></div>
      
      <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start justify-between">
            <Skeleton className="h-5 sm:h-6 w-3/4" />
            <Skeleton className="h-5 sm:h-6 w-10 sm:w-12 rounded-full" />
          </div>
          
          <div className="flex gap-2">
            <Skeleton className="h-4 sm:h-5 w-1/4 rounded-full" />
            <Skeleton className="h-4 sm:h-5 w-1/4 rounded-full" />
          </div>
          
          <div className="bg-gray-50 p-2.5 sm:p-3 rounded-lg space-y-2.5 sm:space-y-3 border border-gray-100">
            <div className="flex">
              <Skeleton className="h-4 w-4 mr-2 flex-shrink-0" />
              <div className="w-full">
                <Skeleton className="h-3.5 sm:h-4 w-full" />
                <Skeleton className="h-3.5 sm:h-4 w-4/5 mt-1" />
              </div>
            </div>
            
            <div className="flex">
              <Skeleton className="h-4 w-4 mr-2 flex-shrink-0" />
              <Skeleton className="h-3.5 sm:h-4 w-1/2" />
            </div>
            
            <div className="flex">
              <Skeleton className="h-4 w-4 mr-2 flex-shrink-0" />
              <Skeleton className="h-3.5 sm:h-4 w-2/3" />
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 sm:px-6 py-3 border-t bg-gray-50">
        <div className="w-full flex items-center justify-center">
          <Skeleton className="h-4 sm:h-5 w-24 sm:w-28" />
          <Skeleton className="h-3.5 sm:h-4 w-3.5 sm:w-4 ml-2" />
        </div>
      </CardFooter>
    </Card>
  );
} 