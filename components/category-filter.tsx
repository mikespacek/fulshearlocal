"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { 
  Utensils, 
  ShoppingBag, 
  Stethoscope, 
  Sparkles, 
  DollarSign, 
  Home, 
  Car, 
  Briefcase, 
  GraduationCap, 
  Church, 
  Dumbbell, 
  Film,
  Wrench,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Category {
  _id: Id<"categories">;
  name: string;
  icon?: string;
  imageUrl?: string;
  description?: string;
  order?: number;
}

interface CategoryFilterProps {
  selectedCategory: Id<"categories"> | null;
  onCategorySelect: (categoryId: Id<"categories"> | null) => void;
  linkToCategory?: boolean;
}

// Define interface for category style
interface CategoryStyle {
  icon: React.ComponentType<any>;
  color: string;
  hoverColor: string;
  textColor: string;
  description: string;
  infoStat: string;
}

// Define category icons and colors
const categoryStyles: Record<string, CategoryStyle> = {
  "Restaurants": { 
    icon: Utensils, 
    color: "bg-red-400",
    hoverColor: "hover:bg-red-500",
    textColor: "text-white",
    description: "Discover local dining options from casual to upscale",
    infoStat: "25+ options"
  },
  "Shopping": { 
    icon: ShoppingBag, 
    color: "bg-emerald-400",
    hoverColor: "hover:bg-emerald-500", 
    textColor: "text-white",
    description: "Browse local stores and boutiques for all your needs",
    infoStat: "Local favorites"
  },
  "Medical": { 
    icon: Stethoscope, 
    color: "bg-teal-700",
    hoverColor: "hover:bg-teal-800", 
    textColor: "text-white",
    description: "Find trusted healthcare providers and medical services",
    infoStat: "Health experts"
  },
  "Beauty": { 
    icon: Sparkles, 
    color: "bg-orange-300",
    hoverColor: "hover:bg-orange-400", 
    textColor: "text-white",
    description: "Pamper yourself with local beauty and wellness services",
    infoStat: "Salons & Spas"
  },
  "Financial": { 
    icon: DollarSign, 
    color: "bg-indigo-800",
    hoverColor: "hover:bg-indigo-900", 
    textColor: "text-white",
    description: "Connect with local financial advisors, banks, and services",
    infoStat: "Financial experts"
  },
  "Real Estate": { 
    icon: Home, 
    color: "bg-purple-500",
    hoverColor: "hover:bg-purple-600", 
    textColor: "text-white",
    description: "Explore real estate options with local agents and services",
    infoStat: "Property listings"
  },
  "Automotive": { 
    icon: Car, 
    color: "bg-yellow-400",
    hoverColor: "hover:bg-yellow-500", 
    textColor: "text-white",
    description: "Find reliable auto services, repairs, and dealerships",
    infoStat: "Auto services"
  },
  "Professional": { 
    icon: Briefcase, 
    color: "bg-teal-500",
    hoverColor: "hover:bg-teal-600", 
    textColor: "text-white",
    description: "Connect with local professionals and business services",
    infoStat: "Trusted pros"
  },
  "Education": { 
    icon: GraduationCap, 
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700", 
    textColor: "text-white",
    description: "Discover schools and educational resources",
    infoStat: "Schools & tutors"
  },
  "Religious": { 
    icon: Church, 
    color: "bg-gray-600",
    hoverColor: "hover:bg-gray-700", 
    textColor: "text-white",
    description: "Find places of worship and religious organizations",
    infoStat: "Faith communities"
  },
  "Fitness": { 
    icon: Dumbbell, 
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600", 
    textColor: "text-white",
    description: "Stay active with local gyms, sports, and fitness services",
    infoStat: "Gyms & trainers"
  },
  "Entertainment": { 
    icon: Film, 
    color: "bg-pink-500",
    hoverColor: "hover:bg-pink-600", 
    textColor: "text-white",
    description: "Find fun things to do in the area",
    infoStat: "Fun & activities"
  },
  "Home Services": { 
    icon: Wrench, 
    color: "bg-blue-700",
    hoverColor: "hover:bg-blue-800", 
    textColor: "text-white",
    description: "Find contractors, repair services, and other home needs",
    infoStat: "Home experts"
  },
  // Default fallback
  "default": { 
    icon: Users, 
    color: "bg-gray-400",
    hoverColor: "hover:bg-gray-500", 
    textColor: "text-white",
    description: "Browse local businesses",
    infoStat: "Local businesses"
  }
};

export function CategoryFilter({ 
  selectedCategory, 
  onCategorySelect,
  linkToCategory = true
}: CategoryFilterProps) {
  const categories = useQuery(api.categories.getAll) as Category[] | undefined;
  const businesses = useQuery(api.businesses.getAll);
  const router = useRouter();

  // Count businesses in each category
  const categoryCount = new Map<string, number>();
  
  if (businesses) {
    businesses.forEach(business => {
      const categoryId = business.categoryId as string;
      categoryCount.set(categoryId, (categoryCount.get(categoryId) || 0) + 1);
    });
  }

  if (!categories) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-10 w-32 flex-shrink-0 rounded-full bg-gray-100 animate-pulse"></div>
        ))}
      </div>
    );
  }

  // Sort categories by order if available
  const sortedCategories = [...categories].sort((a, b) => {
    // If both have order, sort by order
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    // If only one has order, put the one with order first
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    // Otherwise sort by name
    return a.name.localeCompare(b.name);
  });

  // Handler for category card click
  const handleCategoryClick = (category: Category) => {
    if (linkToCategory) {
      // Navigate to the category page
      router.push(`/categories/${category._id}`);
    } else {
      // Use the traditional filter behavior
      onCategorySelect(category._id);
    }
  };

  // Get style for a category
  const getCategoryStyle = (categoryName: string): CategoryStyle => {
    return categoryStyles[categoryName] || categoryStyles.default;
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
        <button
          onClick={() => onCategorySelect(null)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
            selectedCategory === null 
              ? "bg-blue-600 text-white" 
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          All Categories
        </button>
        
        {sortedCategories.map((category: Category) => {
          const style = getCategoryStyle(category.name);
          const IconComponent = style.icon;
          
          return (
            <button 
              key={category._id}
              onClick={() => handleCategoryClick(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                selectedCategory === category._id 
                  ? style.color + " " + style.textColor
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              <IconComponent className="h-4 w-4" />
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
} 