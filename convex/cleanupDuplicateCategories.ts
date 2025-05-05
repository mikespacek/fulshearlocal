import { mutation } from "./_generated/server";

// Define only the categories we want to keep
const finalCategories = [
  {
    name: "Restaurants",
    icon: "utensils",
    imageUrl: "/category-images/restaurants.jpg",
    description: "Fine dining restaurant with elegant table settings",
    order: 1,
  },
  {
    name: "Shopping",
    icon: "shopping-bag",
    imageUrl: "/category-images/shopping.jpg",
    description: "Vibrant shopping district with storefronts",
    order: 2,
  },
  {
    name: "Medical & Dental",
    icon: "hospital",
    imageUrl: "/category-images/medical.jpg",
    description: "Modern medical facility with healthcare professionals",
    order: 3,
  },
  {
    name: "Beauty & Wellness",
    icon: "spa",
    imageUrl: "/category-images/beauty.jpg",
    description: "Beauty salon with professional styling equipment",
    order: 4,
  },
  {
    name: "Financial Services",
    icon: "dollar-sign",
    imageUrl: "/category-images/financial.jpg",
    description: "Financial district with modern office buildings",
    order: 5,
  },
  {
    name: "Real Estate",
    icon: "home",
    imageUrl: "/category-images/real-estate.jpg",
    description: "Luxury home with contemporary architecture",
    order: 6,
  },
  {
    name: "Automotive",
    icon: "car",
    imageUrl: "/category-images/automotive.jpg",
    description: "Modern car dealership with luxury vehicles",
    order: 7,
  },
  {
    name: "Professional Services",
    icon: "briefcase",
    imageUrl: "/category-images/professional.jpg",
    description: "Professional business meeting in a corporate setting",
    order: 8,
  },
  {
    name: "Childcare & Education",
    icon: "school",
    imageUrl: "/category-images/education.jpg",
    description: "Elementary school classroom with desks and supplies",
    order: 9,
  },
  {
    name: "Religious Organizations",
    icon: "church",
    imageUrl: "/category-images/religious.jpg",
    description: "Beautiful church interior with stained glass",
    order: 10,
  },
  {
    name: "Sports & Fitness",
    icon: "running",
    imageUrl: "/category-images/fitness.jpg",
    description: "Modern gym with fitness equipment and people exercising",
    order: 11,
  },
  {
    name: "Recreation & Entertainment",
    icon: "umbrella-beach",
    imageUrl: "/category-images/entertainment.jpg",
    description: "Concert venue with colorful stage lights and audience",
    order: 12,
  },
  {
    name: "Home Services",
    icon: "tools",
    imageUrl: "/category-images/home-services.jpg",
    description: "Professional home service provider at work",
    order: 13,
  },
];

// List of unwanted categories to remove (keep only the ones in our final list)
const categoriesToRemove = ["Retail", "Healthcare", "Education", "Entertainment", "Services"];

// Comprehensive cleanup of categories
export default mutation({
  handler: async (ctx) => {
    const results = {
      created: 0,
      updated: 0,
      deleted: 0,
      preserved: 0,
      total: finalCategories.length,
    };

    // Get all existing categories
    const existingCategories = await ctx.db.query("categories").collect();
    
    // STEP 1: First delete explicitly unwanted categories
    for (const categoryName of categoriesToRemove) {
      const toDelete = existingCategories.filter(c => c.name === categoryName);
      
      for (const category of toDelete) {
        // Check if any businesses use this category
        const businessesWithCategory = await ctx.db
          .query("businesses")
          .filter(q => q.eq(q.field("categoryId"), category._id))
          .collect();
          
        if (businessesWithCategory.length === 0) {
          // Safe to delete - no businesses reference this category
          await ctx.db.delete(category._id);
          results.deleted++;
        } else {
          console.log(`Category ${category.name} has businesses and cannot be deleted`);
        }
      }
    }
    
    // STEP 2: Create a map to track what we have in the final list
    const finalCategoryNames = new Set(finalCategories.map(c => c.name));
    
    // STEP 3: Delete any existing category that's not in our final list
    for (const category of existingCategories) {
      if (!finalCategoryNames.has(category.name) && !categoriesToRemove.includes(category.name)) {
        // Check if any businesses use this category
        const businessesWithCategory = await ctx.db
          .query("businesses")
          .filter(q => q.eq(q.field("categoryId"), category._id))
          .collect();
          
        if (businessesWithCategory.length === 0) {
          // Safe to delete - no businesses reference this category
          await ctx.db.delete(category._id);
          results.deleted++;
        } else {
          console.log(`Unexpected category ${category.name} has businesses and cannot be deleted`);
        }
      }
    }
    
    // STEP 4: Create or update categories based on our final list
    for (const categoryData of finalCategories) {
      // Find all matching categories by name (there could be duplicates)
      const matchingCategories = existingCategories.filter(
        c => c.name === categoryData.name
      );
      
      if (matchingCategories.length > 0) {
        // Keep the first one, update it
        const toKeep = matchingCategories[0];
        await ctx.db.patch(toKeep._id, {
          icon: categoryData.icon,
          imageUrl: categoryData.imageUrl,
          description: categoryData.description,
          order: categoryData.order,
        });
        results.updated++;
        
        // Delete any duplicates beyond the first one
        for (let i = 1; i < matchingCategories.length; i++) {
          const duplicate = matchingCategories[i];
          
          // Check if any businesses use this duplicate category
          const businessesWithCategory = await ctx.db
            .query("businesses")
            .filter(q => q.eq(q.field("categoryId"), duplicate._id))
            .collect();
            
          if (businessesWithCategory.length === 0) {
            // Safe to delete - no businesses reference this category
            await ctx.db.delete(duplicate._id);
            results.deleted++;
          } else {
            // Move businesses to the category we're keeping
            for (const business of businessesWithCategory) {
              await ctx.db.patch(business._id, { categoryId: toKeep._id });
            }
            await ctx.db.delete(duplicate._id);
            results.deleted++;
          }
        }
      } else {
        // Create a new category
        await ctx.db.insert("categories", {
          name: categoryData.name,
          icon: categoryData.icon,
          imageUrl: categoryData.imageUrl,
          description: categoryData.description,
          order: categoryData.order,
        });
        results.created++;
      }
    }
    
    return {
      success: true,
      message: `Created ${results.created}, updated ${results.updated}, deleted ${results.deleted} categories`,
      results,
    };
  },
}); 