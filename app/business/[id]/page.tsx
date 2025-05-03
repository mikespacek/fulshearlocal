import { BusinessDetail } from "@/components/business-detail";

// Server component
export default function BusinessPage({ params }: { params: { id: string } }) {
  return <BusinessDetail id={params.id} />;
} 