"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BusinessCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
          <Skeleton className="h-5 w-1/3 rounded-full" />
          <div className="mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-1" />
          </div>
          <div className="mt-3">
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="mt-3">
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 border-t bg-gray-50">
        <Skeleton className="h-5 w-full" />
      </CardFooter>
    </Card>
  );
} 