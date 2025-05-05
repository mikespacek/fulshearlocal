import { mutation } from "./_generated/server";

// Define the final desired categories
const timestamp = Date.now(); // Add timestamp for cache busting
const finalCategories = [
  {
    name: "Restaurants",
    imageUrl: `/category-images/restaurants.jpg?t=${timestamp}`,
    description: "Fine dining restaurant with elegant table settings",
    order: 1,
  },
  {
    name: "Shopping",
    imageUrl: `/category-images/shopping.jpg?t=${timestamp}`,
    description: "Vibrant shopping district with storefronts",
    order: 2,
  },
  {
    name: "Medical & Dental",
    imageUrl: `/category-images/medical.jpg?t=${timestamp}`,
    description: "Modern medical facility with healthcare professionals",
    order: 3,
  },
  {
    name: "Beauty & Wellness",
    imageUrl: `/category-images/beauty.jpg?t=${timestamp}`,
    description: "Beauty salon with professional styling equipment",
    order: 4,
  },
  {
    name: "Financial Services",
    imageUrl: `/category-images/financial.jpg?t=${timestamp}`,
    description: "Financial district with modern office buildings",
    order: 5,
  },
  {
    name: "Real Estate",
    imageUrl: `/category-images/real-estate.jpg?t=${timestamp}`,
    description: "Luxury home with contemporary architecture",
    order: 6,
  },
  {
    name: "Automotive",
    imageUrl: `/category-images/automotive.jpg?t=${timestamp}`,
    description: "Modern car dealership with luxury vehicles",
    order: 7,
  },
  {
    name: "Professional Services",
    imageUrl: `/category-images/professional.jpg?t=${timestamp}`,
    description: "Professional business meeting in a corporate setting",
    order: 8,
  },
  {
    name: "Childcare & Education",
    imageUrl: `/category-images/education.jpg?t=${timestamp}`,
    description: "Elementary school classroom with desks and supplies",
    order: 9,
  },
  {
    name: "Religious Organizations",
    imageUrl: `/category-images/religious.jpg?t=${timestamp}`,
    description: "Beautiful church interior with stained glass",
    order: 10,
  },
  {
    name: "Sports & Fitness",
    imageUrl: `/category-images/fitness.jpg?t=${timestamp}`,
    description: "Modern gym with fitness equipment and people exercising",
    order: 11,
  },
  {
    name: "Recreation & Entertainment",
    imageUrl: `/category-images/entertainment.jpg?t=${timestamp}`,
    description: "Concert venue with colorful stage lights and audience",
    order: 12,
  },
  {
    name: "Home Services",
    imageUrl: `/category-images/home-services.jpg?t=${timestamp}`,
    description: "Professional home service provider at work",
    order: 13,
  },
];

// Synchronize categories - this will remove extra categories and ensure the list is exactly as defined
export default mutation({
  handler: async (ctx) => {
    const results = {
      created: 0,
      updated: 0,
      deleted: 0,
      total: finalCategories.length,
    };

    // Get all existing categories
    const existingCategories = await ctx.db.query("categories").collect();
    
    // Keep track of which category IDs should be kept
    const categoriesToKeep = new Set();
    
    // Create or update categories based on our final list
    for (const categoryData of finalCategories) {
      // Find the matching category
      const existingCategory = existingCategories.find(
        (c) => c.name === categoryData.name
      );
      
      if (existingCategory) {
        // Update the category with the correct image, description and order
        await ctx.db.patch(existingCategory._id, {
          imageUrl: categoryData.imageUrl,
          description: categoryData.description,
          order: categoryData.order,
        });
        
        // Mark this category to keep
        categoriesToKeep.add(existingCategory._id);
        results.updated++;
      } else {
        // Create a new category
        const newCategoryId = await ctx.db.insert("categories", {
          name: categoryData.name,
          imageUrl: categoryData.imageUrl,
          description: categoryData.description,
          order: categoryData.order,
        });
        
        // Mark this category to keep
        categoriesToKeep.add(newCategoryId);
        results.created++;
      }
    }
    
    // Delete any categories that are not in our final list
    for (const category of existingCategories) {
      if (!categoriesToKeep.has(category._id)) {
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
    
    return {
      success: true,
      message: `Created ${results.created}, updated ${results.updated}, and deleted ${results.deleted} categories`,
      results,
    };
  },
}); 