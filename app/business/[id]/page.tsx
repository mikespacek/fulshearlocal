"use client";

import { BusinessDetail } from "@/components/business-detail";
import { use } from "react";

type PageParams = { id: string };

// Server component
export default function BusinessPage({ params }: { params: PageParams }) {
  // Use React.use() to unwrap params with proper typing
  const unwrappedParams = use(params as any) as PageParams;
  return <BusinessDetail id={unwrappedParams.id} />;
} 