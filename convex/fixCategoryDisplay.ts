import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// The definitive list of categories we want to keep, in order
const masterCategoryList = [
  {
    name: "Restaurants",
    icon: "utensils",
    imageUrl: "https://fulshearlocal.vercel.app/category-images/restaurants.jpg",
    description: "Fine dining restaurant with elegant table settings",
    order: 1,
  },
  {
    name: "Shopping",
    icon: "shopping-bag",
    imageUrl: "https://fulshearlocal.vercel.app/category-images/shopping.jpg",
    description: "Vibrant shopping district with storefronts",
    order: 2,
  },
  {
    name: "Medical & Dental",
    icon: "hospital",
    imageUrl: "https://fulshearlocal.vercel.app/category-images/medical.jpg",
    description: "Modern medical facility with healthcare professionals",
    order: 3,
  },
  {
    name: "Beauty & Wellness",
    icon: "spa",
    imageUrl: "https://fulshearlocal.vercel.app/category-images/beauty.jpg",
    description: "Beauty salon with professional styling equipment",
    order: 4,
  },
  {
    name: "Financial Services",
    icon: "dollar-sign",
    imageUrl: "https://fulshearlocal.vercel.app/category-images/financial.jpg",
    description: "Financial district with modern office buildings",
    order: 5,
  },
  {
    name: "Real Estate",
    icon: "home",
    imageUrl: "https://fulshearlocal.vercel.app/category-images/real-estate.jpg",
    description: "Luxury home with contemporary architecture",
    order: 6,
  },
  {
    name: "Automotive",
    icon: "car",
    imageUrl: "https://fulshearlocal.vercel.app/category-images/automotive.jpg",
    description: "Modern car dealership with luxury vehicles",
    order: 7,
  },
  {
    name: "Professional Services",
    icon: "briefcase",
    imageUrl: "https://fulshearlocal.vercel.app/category-images/professional.jpg",
    description: "Professional business meeting in a corporate setting",
    order: 8,
  },
  {
    name: "Childcare & Education",
    icon: "school",
    imageUrl: "https://fulshearlocal.vercel.app/category-images/education.jpg",
    description: "Elementary school classroom with desks and supplies",
    order: 9,
  },
  {
    name: "Religious Organizations",
    icon: "church", 
    imageUrl: "https://fulshearlocal.vercel.app/category-images/religious.jpg",
    description: "Beautiful church interior with stained glass",
    order: 10,
  },
  {
    name: "Sports & Fitness",
    icon: "running",
    imageUrl: "https://fulshearlocal.vercel.app/category-images/fitness.jpg",
    description: "Modern gym with fitness equipment and people exercising",
    order: 11,
  },
  {
    name: "Recreation & Entertainment",
    icon: "umbrella-beach",
    imageUrl: "https://fulshearlocal.vercel.app/category-images/entertainment.jpg",
    description: "Concert venue with colorful stage lights and audience",
    order: 12,
  },
  {
    name: "Home Services",
    icon: "tools",
    imageUrl: "https://fulshearlocal.vercel.app/category-images/home-services.jpg",
    description: "Professional home service provider at work",
    order: 13,
  },
];

// Complete cleanup function that:
// 1. Ensures only categories from masterCategoryList exist
// 2. Ensures no duplicate categories by name
// 3. Reassigns businesses from deleted categories
// 4. Ensures all category data is consistent and up-to-date
export default mutation({
  handler: async (ctx) => {
    const results = {
      created: 0,
      updated: 0,
      deleted: 0,
      businessesReassigned: 0,
      businessesByCategory: {} as Record<string, number>,
      emptyCategories: [] as string[]
    };

    // Get all existing categories and businesses
    const existingCategories = await ctx.db.query("categories").collect();
    const allBusinesses = await ctx.db.query("businesses").collect();
    
    // Create a map of category names to their IDs for quick lookup
    const categoryNameToIdMap: Record<string, Id<"categories">[]> = {};
    for (const category of existingCategories) {
      if (!categoryNameToIdMap[category.name]) {
        categoryNameToIdMap[category.name] = [];
      }
      categoryNameToIdMap[category.name].push(category._id);
    }
    
    // Build a map of business counts by category
    const businessCountByCategory: Record<string, number> = {};
    for (const business of allBusinesses) {
      if (business.categoryId) {
        const categoryIdStr = business.categoryId.toString();
        if (!businessCountByCategory[categoryIdStr]) {
          businessCountByCategory[categoryIdStr] = 0;
        }
        businessCountByCategory[categoryIdStr]++;
      }
    }
    
    // Create a map to track the canonical category ID for each name
    const canonicalCategoryIds: Record<string, Id<"categories">> = {};

    // First pass: Process all categories from master list
    for (const masterCategory of masterCategoryList) {
      const matchingCategoryIds = categoryNameToIdMap[masterCategory.name] || [];
      
      if (matchingCategoryIds.length === 0) {
        // Create the category if it doesn't exist
        const newId = await ctx.db.insert("categories", {
          name: masterCategory.name,
          icon: masterCategory.icon,
          imageUrl: masterCategory.imageUrl,
          description: masterCategory.description,
          order: masterCategory.order,
        });
        
        canonicalCategoryIds[masterCategory.name] = newId;
        results.created++;
        
        // No businesses yet
        results.businessesByCategory[masterCategory.name] = 0;
        results.emptyCategories.push(masterCategory.name);
      } 
      else {
        // Keep the first one (should be the oldest one) and update it
        const canonicalId = matchingCategoryIds[0];
        canonicalCategoryIds[masterCategory.name] = canonicalId;
        
        await ctx.db.patch(canonicalId, {
          icon: masterCategory.icon,
          imageUrl: masterCategory.imageUrl, 
          description: masterCategory.description,
          order: masterCategory.order,
        });
        results.updated++;
        
        // Record business count
        const canonicalIdStr = canonicalId.toString();
        results.businessesByCategory[masterCategory.name] = 
          businessCountByCategory[canonicalIdStr] || 0;
        
        if ((businessCountByCategory[canonicalIdStr] || 0) === 0) {
          results.emptyCategories.push(masterCategory.name);
        }
        
        // Process duplicates (if any)
        if (matchingCategoryIds.length > 1) {
          for (let i = 1; i < matchingCategoryIds.length; i++) {
            const duplicateId = matchingCategoryIds[i];
            
            // Move any businesses that use this duplicate to the canonical category
            for (const business of allBusinesses) {
              if (business.categoryId && business.categoryId.toString() === duplicateId.toString()) {
                await ctx.db.patch(business._id, { 
                  categoryId: canonicalId,
                  lastUpdated: Date.now()
                });
                results.businessesReassigned++;
              }
            }
            
            // Now delete the duplicate
            await ctx.db.delete(duplicateId);
            results.deleted++;
          }
        }
      }
    }
    
    // Second pass: Delete any categories that aren't in our master list
    const masterCategoryNames = new Set(masterCategoryList.map(c => c.name));
    for (const category of existingCategories) {
      if (!masterCategoryNames.has(category.name)) {
        // This category should be deleted, but first we need to reassign businesses
        const businessesWithCategory = allBusinesses.filter(
          b => b.categoryId && b.categoryId.toString() === category._id.toString()
        );
        
        if (businessesWithCategory.length > 0) {
          // Find the best category to reassign to
          const bestCategoryName = "Professional Services"; // Default fallback
          const canonicalId = canonicalCategoryIds[bestCategoryName];
          
          // Reassign all businesses
          for (const business of businessesWithCategory) {
            await ctx.db.patch(business._id, { 
              categoryId: canonicalId,
              lastUpdated: Date.now()
            });
            results.businessesReassigned++;
          }
        }
        
        // Delete the category
        await ctx.db.delete(category._id);
        results.deleted++;
      }
    }
    
    return {
      success: true,
      message: `Created ${results.created}, updated ${results.updated}, deleted ${results.deleted} categories. Reassigned ${results.businessesReassigned} businesses.`,
      businessesByCategory: results.businessesByCategory,
      emptyCategories: results.emptyCategories,
      results,
    };
  },
}); 