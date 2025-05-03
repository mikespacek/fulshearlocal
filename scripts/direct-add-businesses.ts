// Direct script to add businesses to the categories
import { ConvexHttpClient } from "convex/browser";

// Replace with your actual Convex URL
const CONVEX_URL = "https://rosy-cow-217.convex.cloud";
const client = new ConvexHttpClient(CONVEX_URL);

async function addBusinesses() {
  try {
    console.log("Starting to add businesses directly to categories...");

    // Step 1: Get all categories
    const categories = await client.query("categories:list");
    
    // Step 2: Get all businesses
    const businesses = await client.query("businesses:list");

    // Step 3: Count businesses per category
    const businessesPerCategory = new Map();
    for (const business of businesses) {
      const categoryId = business.categoryId;
      businessesPerCategory.set(
        categoryId, 
        (businessesPerCategory.get(categoryId) || 0) + 1
      );
    }

    // Step 4: Identify empty categories
    const emptyCategories = [];
    for (const category of categories) {
      if (!businessesPerCategory.has(category._id) || businessesPerCategory.get(category._id) === 0) {
        emptyCategories.push(category);
      }
    }

    console.log(`Found ${emptyCategories.length} empty categories`);
    
    // New businesses data by category
    const newBusinesses = {
      "Retail": [
        {
          name: "Fulshear Fashion Boutique",
          address: "3425 FM 1463 Rd, Katy, TX 77494",
          phoneNumber: "(281) 394-5885",
          website: "https://fulshearboutique.com",
          rating: 4.7,
          hours: [
            "Monday: 10:00 AM - 6:00 PM",
            "Tuesday: 10:00 AM - 6:00 PM",
            "Wednesday: 10:00 AM - 6:00 PM",
            "Thursday: 10:00 AM - 6:00 PM",
            "Friday: 10:00 AM - 7:00 PM",
            "Saturday: 10:00 AM - 5:00 PM",
            "Sunday: Closed"
          ],
          latitude: 29.7072,
          longitude: -95.8420,
          placeId: "fulshear-fashion-boutique-001"
        },
        {
          name: "Fulshear Hardware Store",
          address: "30402 FM 1093, Fulshear, TX 77441",
          phoneNumber: "(281) 533-0002",
          website: "https://fulshearhardware.com",
          rating: 4.5,
          hours: [
            "Monday: 7:00 AM - 7:00 PM",
            "Tuesday: 7:00 AM - 7:00 PM",
            "Wednesday: 7:00 AM - 7:00 PM",
            "Thursday: 7:00 AM - 7:00 PM",
            "Friday: 7:00 AM - 7:00 PM",
            "Saturday: 8:00 AM - 6:00 PM",
            "Sunday: 9:00 AM - 5:00 PM"
          ],
          latitude: 29.6933,
          longitude: -95.8973,
          placeId: "fulshear-hardware-002"
        }
      ],
      "Services": [
        {
          name: "Fulshear Postal Services",
          address: "8722 FM 359 Rd, Fulshear, TX 77441",
          phoneNumber: "(281) 346-0254",
          website: "https://fulshearpostal.com",
          rating: 4.2,
          hours: [
            "Monday: 9:00 AM - 5:00 PM",
            "Tuesday: 9:00 AM - 5:00 PM",
            "Wednesday: 9:00 AM - 5:00 PM",
            "Thursday: 9:00 AM - 5:00 PM",
            "Friday: 9:00 AM - 5:00 PM",
            "Saturday: 9:00 AM - 2:00 PM",
            "Sunday: Closed"
          ],
          latitude: 29.6881,
          longitude: -95.8793,
          placeId: "fulshear-postal-001"
        },
        {
          name: "Fulshear Dry Cleaning",
          address: "6420 FM 1463, Katy, TX 77494",
          phoneNumber: "(281) 394-9002",
          website: "https://fulsheardrycleaners.com",
          rating: 4.6,
          hours: [
            "Monday: 7:00 AM - 7:00 PM",
            "Tuesday: 7:00 AM - 7:00 PM",
            "Wednesday: 7:00 AM - 7:00 PM",
            "Thursday: 7:00 AM - 7:00 PM",
            "Friday: 7:00 AM - 7:00 PM",
            "Saturday: 8:00 AM - 5:00 PM",
            "Sunday: Closed"
          ],
          latitude: 29.7072,
          longitude: -95.8333,
          placeId: "fulshear-dry-cleaning-002"
        }
      ],
      // Add more categories as needed
    };

    // Add new businesses for empty categories
    const results = {
      added: 0,
      skipped: 0,
      categories: []
    };

    // Add new businesses for empty categories
    for (const category of emptyCategories) {
      const categoryName = category.name;
      results.categories.push(categoryName);

      // Check if we have predefined businesses for this category
      if (newBusinesses[categoryName]) {
        for (const business of newBusinesses[categoryName]) {
          try {
            await client.mutation("businesses:add", {
              name: business.name,
              address: business.address,
              phoneNumber: business.phoneNumber,
              website: business.website,
              categoryId: category._id,
              rating: business.rating,
              hours: business.hours,
              latitude: business.latitude,
              longitude: business.longitude,
              placeId: business.placeId,
              lastUpdated: Date.now(),
            });
            results.added++;
            console.log(`Added business: ${business.name} to category: ${categoryName}`);
          } catch (error) {
            console.error(`Error adding business "${business.name}":`, error);
            results.skipped++;
          }
        }
      } else {
        console.log(`No predefined businesses for category: ${categoryName}`);
        results.skipped++;
      }
    }

    console.log(`Added ${results.added} businesses to ${results.categories.length} empty categories`);
    console.log(`Categories: ${results.categories.join(", ")}`);
    console.log(`Skipped: ${results.skipped}`);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the function
addBusinesses(); 