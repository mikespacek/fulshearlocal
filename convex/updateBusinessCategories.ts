import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Mutation to fix business categories
export const reassignBusinessCategories = mutation({
  args: {
    adminKey: v.string(), // Simple admin key for basic protection
  },
  handler: async (ctx, args) => {
    // Simple auth - in a real app, use proper authentication
    const adminKey = process.env.ADMIN_KEY;
    if (!adminKey || args.adminKey !== adminKey) {
      throw new Error("Unauthorized");
    }

    // Step 1: Get all categories
    const categories = await ctx.db.query("categories").collect();
    
    // Create a map of category names to IDs for easy lookup
    const categoryMap = new Map<string, Id<"categories">>();
    for (const category of categories) {
      categoryMap.set(category.name, category._id);
    }

    // Step 2: Get all businesses
    const businesses = await ctx.db.query("businesses").collect();

    // Step 3: Define category keywords for better matching
    const categoryKeywords: Record<string, string[]> = {
      "Restaurants": ["restaurant", "cafe", "bakery", "bar", "food", "pizza", "burger", "taco", "dining", "coffee", "grill"],
      "Shopping": ["store", "shop", "market", "retail", "clothing", "boutique", "mall", "grocery", "supermarket", "outlet"],
      "Medical": ["hospital", "doctor", "dental", "dentist", "clinic", "care", "health", "medical", "pharmacy", "orthopedic", "cardiology", "emergency"],
      "Beauty": ["salon", "spa", "beauty", "hair", "nail", "makeup", "barber", "stylist", "cosmetic", "esthetic"],
      "Financial": ["bank", "finance", "financial", "loan", "credit", "insurance", "retirement", "investment", "wealth", "mortgage"],
      "Real Estate": ["realty", "real estate", "realtor", "property", "home", "housing", "apartment", "condo", "broker", "mortgage"],
      "Automotive": ["auto", "car", "vehicle", "dealership", "repair", "tire", "oil", "wash", "collision", "mechanic", "part", "service"],
      "Professional": ["law", "attorney", "legal", "accounting", "accountant", "tax", "consulting", "business", "corporate", "architect", "engineering"],
      "Education": ["school", "academy", "university", "college", "tutor", "training", "learning", "education", "preschool", "daycare", "childcare"],
      "Religious": ["church", "temple", "mosque", "synagogue", "worship", "religion", "ministry", "faith", "spiritual", "prayer", "chapel"],
      "Fitness": ["gym", "fitness", "exercise", "workout", "yoga", "pilates", "sport", "athletic", "dance", "training", "personal trainer"],
      "Entertainment": ["entertainment", "theater", "cinema", "movie", "game", "amusement", "park", "bowling", "recreation", "play"],
      "Home Services": ["contractor", "home", "repair", "plumbing", "electric", "landscaping", "cleaning", "painting", "roofing", "construction", "renovation"]
    };

    // Step 4: Process each business and update its category
    const results = {
      updated: 0,
      skipped: 0,
      noCategory: 0,
    };

    for (const business of businesses) {
      // Check if name or address indicates a category
      let foundCategory = false;
      let categoryId: Id<"categories"> | null = null;

      // Convert business name and address to lowercase for easier matching
      const businessName = business.name.toLowerCase();
      const businessAddress = business.address.toLowerCase();
      
      // Check for category keywords in business name and address
      for (const [categoryName, keywords] of Object.entries(categoryKeywords)) {
        if (categoryMap.has(categoryName)) {
          for (const keyword of keywords) {
            if (businessName.includes(keyword.toLowerCase()) || businessAddress.includes(keyword.toLowerCase())) {
              categoryId = categoryMap.get(categoryName)!;
              foundCategory = true;
              break;
            }
          }
        }
        if (foundCategory) break;
      }

      // If no category found by name, try to make an educated guess
      if (!foundCategory) {
        // Restaurant heuristics
        if (businessName.includes("grill") || businessName.includes("bbq") || 
            businessName.includes("kitchen") || businessName.includes("eat") ||
            businessName.includes("taco") || businessName.includes("pizza") ||
            businessName.includes("burger") || businessName.includes("food") ||
            businessName.includes("restaurant") || businessName.includes("cafe") ||
            businessName.includes("coffee") || businessName.includes("bakery")) {
          categoryId = categoryMap.get("Restaurants")!;
          foundCategory = true;
        }
        // Shopping heuristics
        else if (businessName.includes("market") || businessName.includes("store") ||
                businessName.includes("shop") || businessName.includes("mart") ||
                businessName.includes("outlet") || businessName.includes("mall")) {
          categoryId = categoryMap.get("Shopping")!;
          foundCategory = true;
        }
        // Default to Professional Services if still no match
        else if (categoryMap.has("Professional")) {
          categoryId = categoryMap.get("Professional")!;
          foundCategory = true;
        }
      }

      // Update the business if we found a valid category
      if (foundCategory && categoryId) {
        await ctx.db.patch(business._id, {
          categoryId: categoryId
        });
        results.updated++;
      } else {
        results.skipped++;
        results.noCategory++;
      }
    }

    return {
      success: true,
      message: `Updated ${results.updated} businesses, skipped ${results.skipped} businesses, couldn't find category for ${results.noCategory} businesses`,
      timestamp: Date.now()
    };
  }
}); 