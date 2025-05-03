import { mutation } from "./_generated/server";

const categoryImages = [
  {
    name: "Restaurants",
    imageUrl: "/category-images/restaurants.jpg",
    description: "Fine dining restaurant with elegant table settings",
    order: 1,
  },
  {
    name: "Shopping",
    imageUrl: "/category-images/shopping.jpg",
    description: "Vibrant shopping district with storefronts",
    order: 2,
  },
  {
    name: "Medical & Dental",
    imageUrl: "/category-images/medical.jpg",
    description: "Modern medical facility with healthcare professionals",
    order: 3,
  },
  {
    name: "Beauty & Wellness",
    imageUrl: "/category-images/beauty.jpg",
    description: "Beauty salon with professional styling equipment",
    order: 4,
  },
  {
    name: "Financial Services",
    imageUrl: "/category-images/financial.jpg",
    description: "Financial district with modern office buildings",
    order: 5,
  },
  {
    name: "Real Estate",
    imageUrl: "/category-images/real-estate.jpg",
    description: "Luxury home with contemporary architecture",
    order: 6,
  },
  {
    name: "Automotive",
    imageUrl: "/category-images/automotive.jpg",
    description: "Modern car dealership with luxury vehicles",
    order: 7,
  },
  {
    name: "Professional Services",
    imageUrl: "/category-images/professional.jpg",
    description: "Professional business meeting in a corporate setting",
    order: 8,
  },
  {
    name: "Childcare & Education",
    imageUrl: "/category-images/education.jpg",
    description: "Elementary school classroom with desks and supplies",
    order: 9,
  },
  {
    name: "Religious Organizations",
    imageUrl: "/category-images/religious.jpg",
    description: "Beautiful church interior with stained glass",
    order: 10,
  },
  {
    name: "Sports & Fitness",
    imageUrl: "/category-images/fitness.jpg",
    description: "Modern gym with fitness equipment and people exercising",
    order: 11,
  },
  {
    name: "Recreation & Entertainment",
    imageUrl: "/category-images/entertainment.jpg",
    description: "Concert venue with colorful stage lights and audience",
    order: 12,
  },
  {
    name: "Home Services",
    imageUrl: "/category-images/home-services.jpg",
    description: "Professional home service provider at work",
    order: 13,
  },
];

// Update categories with images and descriptions
export default mutation({
  handler: async (ctx) => {
    const results = {
      updated: 0,
      skipped: 0,
      total: categoryImages.length,
    };

    // Get all existing categories
    const existingCategories = await ctx.db.query("categories").collect();
    
    // Update each category
    for (const categoryData of categoryImages) {
      // Find the matching category
      const existingCategory = existingCategories.find(
        (c) => c.name === categoryData.name
      );
      
      if (existingCategory) {
        // Update the category with the image and description
        await ctx.db.patch(existingCategory._id, {
          imageUrl: categoryData.imageUrl,
          description: categoryData.description,
          order: categoryData.order,
        });
        
        results.updated++;
      } else {
        results.skipped++;
      }
    }
    
    return {
      success: true,
      message: `Updated ${results.updated} categories with unique images and descriptions`,
      results,
    };
  },
}); 