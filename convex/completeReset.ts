import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * This is a complete reset function that:
 * 1. Deletes all businesses in the database
 * 2. Re-adds only the real businesses
 */
export const resetBusinessDatabase = mutation({
  handler: async (ctx) => {
    try {
      // STEP 1: Delete all existing businesses
      const allBusinesses = await ctx.db.query("businesses").collect();
      
      for (const business of allBusinesses) {
        await ctx.db.delete(business._id);
        console.log(`Deleted business: ${business.name}`);
      }
      
      console.log(`Deleted all ${allBusinesses.length} existing businesses`);
      
      // STEP 2: Get categories for mapping
      const categories = await ctx.db.query("categories").collect();
      const categoryMap = new Map();
      
      for (const category of categories) {
        categoryMap.set(category.name, category._id);
      }
      
      // STEP 3: Add real businesses from the imported array
      const results = {
        added: 0,
        errors: 0,
      };
      
      // Get the businesses data - this is directly from the file
      const fulshearBusinesses = [
        // Restaurants
        {
          name: "Essence House Cafe",
          address: "8506 Synovus Dr Suite 100, Fulshear, TX 77441",
          phoneNumber: "(832) 377-2565",
          website: "https://www.essencehousecafe.com",
          rating: 4.6,
          hours: [
            "Monday: 7:00 AM - 4:00 PM",
            "Tuesday: 7:00 AM - 4:00 PM",
            "Wednesday: 7:00 AM - 4:00 PM",
            "Thursday: 7:00 AM - 4:00 PM",
            "Friday: 7:00 AM - 4:00 PM",
            "Saturday: 8:00 AM - 4:00 PM",
            "Sunday: 8:00 AM - 3:00 PM",
          ],
          latitude: 29.686995,
          longitude: -95.891523,
          placeId: "ChIJFzr1Nfj_QIYR7aXG-Sy-3vA",
          categoryName: "Restaurants",
          description: "Essence House Cafe is a cozy local eatery specializing in fresh, organic coffee, breakfast items, sandwiches, and homemade pastries. With a warm, inviting atmosphere and free WiFi, it's a popular spot for both casual dining and remote working. Their breakfast burritos and avocado toast are local favorites."
        },
        {
          name: "Dozier's BBQ",
          address: "8222 FM 359, Fulshear, TX 77441",
          phoneNumber: "(281) 346-1411",
          website: "https://doziersbbq.com",
          rating: 4.5,
          hours: [
            "Monday: 11:00 AM - 8:00 PM",
            "Tuesday: 11:00 AM - 8:00 PM",
            "Wednesday: 11:00 AM - 8:00 PM",
            "Thursday: 11:00 AM - 8:00 PM",
            "Friday: 11:00 AM - 8:00 PM",
            "Saturday: 11:00 AM - 8:00 PM",
            "Sunday: 11:00 AM - 6:00 PM",
          ],
          latitude: 29.691246,
          longitude: -95.889805,
          placeId: "ChIJSxsZ0Pj_QIYRjYz5sEw_N-c",
          categoryName: "Restaurants",
          description: "A Fulshear institution since 1957, Dozier's BBQ offers authentic Texas-style smoked meats and homemade sides in a rustic setting. Their pit-smoked brisket, ribs, and sausage have made them a destination for BBQ enthusiasts across the region. They also feature a meat market where you can purchase their famous smoked meats to take home."
        },
        
        // Shopping
        {
          name: "The Fulshear Shoppes",
          address: "6630 FM 1463, Fulshear, TX 77441",
          phoneNumber: "(832) 471-1122",
          website: "https://www.thefulshearshoppe.com",
          rating: 4.7,
          hours: [
            "Monday: 10:00 AM - 6:00 PM",
            "Tuesday: 10:00 AM - 6:00 PM",
            "Wednesday: 10:00 AM - 6:00 PM",
            "Thursday: 10:00 AM - 6:00 PM",
            "Friday: 10:00 AM - 6:00 PM",
            "Saturday: 10:00 AM - 5:00 PM",
            "Sunday: Closed",
          ],
          latitude: 29.703783,
          longitude: -95.877684,
          placeId: "ChIJ5ZSIfDP-QIYRMl_tYLYnN2k",
          categoryName: "Shopping",
          description: "The Fulshear Shoppes is a charming collection of boutique retail stores offering a variety of unique gifts, home decor, clothing, and accessories. This shopping destination features locally owned businesses with personalized service and distinctive merchandise you won't find in chain stores. They frequently host special events and seasonal promotions."
        },
        {
          name: "Fulshear Floral Design",
          address: "30417 5th St, Fulshear, TX 77441",
          phoneNumber: "(281) 533-9466",
          website: "https://www.fulshearfloraldesign.com",
          rating: 4.9,
          hours: [
            "Monday: 9:00 AM - 5:00 PM",
            "Tuesday: 9:00 AM - 5:00 PM",
            "Wednesday: 9:00 AM - 5:00 PM",
            "Thursday: 9:00 AM - 5:00 PM",
            "Friday: 9:00 AM - 5:00 PM",
            "Saturday: 10:00 AM - 2:00 PM",
            "Sunday: Closed",
          ],
          latitude: 29.693775,
          longitude: -95.889599,
          placeId: "ChIJUVq1r_j_QIYRx5AYkEyEGa8",
          categoryName: "Shopping",
          description: "Fulshear Floral Design is a premier florist offering stunning floral arrangements for all occasions. From wedding bouquets to sympathy arrangements, their experienced designers create beautiful custom designs using fresh, high-quality flowers. They provide delivery throughout Fulshear and surrounding areas and also offer plants, gift baskets, and unique home accessories."
        },
        
        // Medical & Dental
        {
          name: "Fulshear Dental",
          address: "29818 FM 1093 #900, Fulshear, TX 77441",
          phoneNumber: "(281) 346-8388",
          website: "https://www.fulsheardental.com",
          rating: 4.9,
          hours: [
            "Monday: 8:00 AM - 5:00 PM",
            "Tuesday: 8:00 AM - 5:00 PM",
            "Wednesday: 8:00 AM - 5:00 PM",
            "Thursday: 8:00 AM - 5:00 PM",
            "Friday: 8:00 AM - 2:00 PM",
            "Saturday: Closed",
            "Sunday: Closed",
          ],
          latitude: 29.701997,
          longitude: -95.877589,
          placeId: "ChIJM3fHb0H-QIYRlwvx2Y1KZfA",
          categoryName: "Medical & Dental",
          description: "Fulshear Dental provides comprehensive family dentistry services in a modern, comfortable environment. Their team offers preventive care, cosmetic dentistry, restorations, and pediatric services. Using the latest dental technology, they ensure painless treatments and beautiful results. They accept most major insurance plans and offer financing options for extensive treatments."
        },
        {
          name: "Fulshear Family Medicine",
          address: "7629 Tiki Dr, Fulshear, TX 77441",
          phoneNumber: "(281) 346-0018",
          website: "https://fulshearfamilymed.com",
          rating: 4.8,
          hours: [
            "Monday: 8:00 AM - 5:00 PM",
            "Tuesday: 8:00 AM - 5:00 PM",
            "Wednesday: 8:00 AM - 5:00 PM",
            "Thursday: 8:00 AM - 5:00 PM",
            "Friday: 8:00 AM - 5:00 PM",
            "Saturday: Closed",
            "Sunday: Closed",
          ],
          latitude: 29.689742,
          longitude: -95.892321,
          placeId: "ChIJFYdKPPj_QIYR5bU3UBQwXvM",
          categoryName: "Medical & Dental",
          description: "Fulshear Family Medicine is a trusted primary care practice serving patients of all ages. Their board-certified physicians provide comprehensive healthcare services including preventive care, chronic disease management, women's health, and pediatric services. With same-day appointments available and a patient-centered approach, they focus on building long-term relationships with families in the community."
        }
      ];
      
      for (const businessData of fulshearBusinesses) {
        try {
          // Get categoryId from name
          const categoryId = categoryMap.get(businessData.categoryName);
          
          if (!categoryId) {
            console.warn(`Could not find category: ${businessData.categoryName} for business: ${businessData.name}`);
            results.errors++;
            continue;
          }
          
          // Prepare business object for database (without categoryName)
          const { categoryName, ...businessForDb } = businessData;
          
          // Insert new business
          await ctx.db.insert("businesses", {
            ...businessForDb,
            categoryId,
            lastUpdated: Date.now(),
          });
          
          results.added++;
          console.log(`Re-added business: ${businessData.name}`);
        } catch (error) {
          console.error(`Error processing business: ${businessData.name}`, error);
          results.errors++;
        }
      }
      
      return {
        success: true,
        message: `Database reset complete: Deleted ${allBusinesses.length} businesses, added ${results.added} real businesses`,
        results: {
          deleted: allBusinesses.length,
          added: results.added,
          errors: results.errors
        },
      };
    } catch (error) {
      console.error("Error resetting database:", error);
      throw new Error(`Failed to reset database: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
}); 