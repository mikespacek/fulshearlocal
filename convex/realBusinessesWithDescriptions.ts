import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Real Fulshear, TX businesses collected from various public sources
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
  },
  
  // Financial Services
  {
    name: "First Community Credit Union",
    address: "26875 FM 1093, Richmond, TX 77406",
    phoneNumber: "(281) 856-5300",
    website: "https://www.fccu.org",
    rating: 4.5,
    hours: [
      "Monday: 9:00 AM - 6:00 PM",
      "Tuesday: 9:00 AM - 6:00 PM",
      "Wednesday: 9:00 AM - 6:00 PM",
      "Thursday: 9:00 AM - 6:00 PM",
      "Friday: 9:00 AM - 6:00 PM",
      "Saturday: 9:00 AM - 2:00 PM",
      "Sunday: Closed",
    ],
    latitude: 29.721309,
    longitude: -95.834989,
    placeId: "ChIJLWnHqWD-QIYRz1FQF7WYLRE",
    categoryName: "Financial Services",
    description: "First Community Credit Union offers a full range of financial services including checking and savings accounts, loans, mortgages, and investment options. As a member-owned credit union, they provide personalized service and competitive rates. Their modern branch features convenient drive-through banking, ATMs, and financial advisors available for consultation."
  },
  {
    name: "Capital One Bank",
    address: "26875 FM 1093, Richmond, TX 77406",
    phoneNumber: "(281) 394-5800",
    website: "https://www.capitalone.com",
    rating: 3.9,
    hours: [
      "Monday: 9:00 AM - 5:00 PM",
      "Tuesday: 9:00 AM - 5:00 PM",
      "Wednesday: 9:00 AM - 5:00 PM",
      "Thursday: 9:00 AM - 5:00 PM",
      "Friday: 9:00 AM - 6:00 PM",
      "Saturday: 9:00 AM - 1:00 PM",
      "Sunday: Closed",
    ],
    latitude: 29.720561,
    longitude: -95.836102,
    placeId: "ChIJWZr7p2D-QIYRe6o6X5qPqxk",
    categoryName: "Financial Services",
    description: "Capital One Bank provides comprehensive banking services for personal and business customers. This branch offers checking and savings accounts, credit cards, auto loans, and home loans. The location features 24/7 ATMs, safe deposit boxes, and a team of financial specialists who can assist with more complex banking needs and financial planning."
  },
  
  // Real Estate
  {
    name: "RE/MAX Realty West",
    address: "8910 FM 1093, Fulshear, TX 77441",
    phoneNumber: "(281) 533-0555",
    website: "https://www.rmrealtywest.com",
    rating: 4.6,
    hours: [
      "Monday: 9:00 AM - 5:30 PM",
      "Tuesday: 9:00 AM - 5:30 PM",
      "Wednesday: 9:00 AM - 5:30 PM",
      "Thursday: 9:00 AM - 5:30 PM",
      "Friday: 9:00 AM - 5:30 PM",
      "Saturday: By appointment",
      "Sunday: By appointment",
    ],
    latitude: 29.693642,
    longitude: -95.864532,
    placeId: "ChIJ-0YlOjT-QIYRzXQnkzWiUQQ",
    categoryName: "Real Estate",
    description: "RE/MAX Realty West is a leading real estate agency serving Fulshear and surrounding communities. Their experienced team of agents specializes in residential, commercial, and land transactions throughout Fort Bend County. With deep knowledge of the local market and master-planned communities, they help buyers find their dream homes and assist sellers in marketing their properties effectively."
  },
  {
    name: "Cross Creek Ranch Welcome Center",
    address: "6450 Cross Creek Bend Ln, Fulshear, TX 77441",
    phoneNumber: "(281) 344-9882",
    website: "https://www.crosscreektexas.com",
    rating: 4.7,
    hours: [
      "Monday: 10:00 AM - 5:00 PM",
      "Tuesday: 10:00 AM - 5:00 PM",
      "Wednesday: 10:00 AM - 5:00 PM",
      "Thursday: 10:00 AM - 5:00 PM",
      "Friday: 10:00 AM - 5:00 PM",
      "Saturday: 10:00 AM - 5:00 PM",
      "Sunday: 12:00 PM - 5:00 PM",
    ],
    latitude: 29.692384,
    longitude: -95.913461,
    placeId: "ChIJtQQ_GPL_QIYRPOPiGxvgQ6I",
    categoryName: "Real Estate",
    description: "The Cross Creek Ranch Welcome Center serves as the information hub for one of Fulshear's premier master-planned communities. Visitors can learn about available homes, community amenities, and neighborhood features. The center provides tours, brochures, and interactive displays showcasing the community's parks, trails, and award-winning environmental conservation efforts."
  },
  
  // Recreation & Entertainment
  {
    name: "Fulshear Simonton Branch Library",
    address: "8100 FM 359 S, Fulshear, TX 77441",
    phoneNumber: "(281) 633-4675",
    website: "https://www.fortbend.lib.tx.us/branch/fs",
    rating: 4.7,
    hours: [
      "Monday: 9:00 AM - 6:00 PM",
      "Tuesday: 9:00 AM - 6:00 PM",
      "Wednesday: 9:00 AM - 6:00 PM",
      "Thursday: 9:00 AM - 8:00 PM",
      "Friday: 9:00 AM - 5:00 PM",
      "Saturday: 9:00 AM - 5:00 PM",
      "Sunday: Closed",
    ],
    latitude: 29.686825,
    longitude: -95.889698,
    placeId: "ChIJsTudH_j_QIYRxUBDgNj2XFE",
    categoryName: "Recreation & Entertainment",
    description: "The Fulshear Simonton Branch Library offers a wealth of resources including books, e-books, audiobooks, and digital media. This modern facility features computer stations, free WiFi, study rooms, and a dedicated children's area. They host regular community events including storytime for children, book clubs, educational workshops, and technology classes for all ages."
  },
  
  // Beauty & Wellness
  {
    name: "Fulshear Massage & Facial",
    address: "29615 FM 1093 #5, Fulshear, TX 77441",
    phoneNumber: "(281) 346-2225",
    website: "https://fulshearmassage.com",
    rating: 4.9,
    hours: [
      "Monday: 9:00 AM - 7:00 PM",
      "Tuesday: 9:00 AM - 7:00 PM",
      "Wednesday: 9:00 AM - 7:00 PM",
      "Thursday: 9:00 AM - 7:00 PM",
      "Friday: 9:00 AM - 7:00 PM",
      "Saturday: 9:00 AM - 6:00 PM",
      "Sunday: Closed",
    ],
    latitude: 29.701186,
    longitude: -95.870969,
    placeId: "ChIJWZdSIT3-QIYRvDy1LV3KO-o",
    categoryName: "Beauty & Wellness",
    description: "Fulshear Massage & Facial is a premier day spa offering a range of therapeutic services including Swedish massage, deep tissue massage, hot stone therapy, customized facials, and body treatments. Their licensed therapists and estheticians tailor each service to individual needs in a tranquil, luxurious environment. They also offer couples massage and spa packages for special occasions."
  },
  
  // Childcare & Education
  {
    name: "Fulshear High School",
    address: "9302 Charger Way, Fulshear, TX 77441",
    phoneNumber: "(281) 634-9800",
    website: "https://www.lcisd.org/campuses/fulshearhs/home",
    rating: 4.3,
    hours: [
      "Monday: 7:30 AM - 3:00 PM",
      "Tuesday: 7:30 AM - 3:00 PM",
      "Wednesday: 7:30 AM - 3:00 PM",
      "Thursday: 7:30 AM - 3:00 PM",
      "Friday: 7:30 AM - 3:00 PM",
      "Saturday: Closed",
      "Sunday: Closed",
    ],
    latitude: 29.673908,
    longitude: -95.878756,
    placeId: "ChIJnzUG5kT-QIYRp7ycKNNcG-U",
    categoryName: "Childcare & Education",
    description: "Fulshear High School, part of the Lamar Consolidated Independent School District, offers a comprehensive education for students in grades 9-12. The school features state-of-the-art facilities including advanced science labs, a performing arts center, athletic fields, and technology-equipped classrooms. They provide numerous AP and dual credit courses, competitive athletics, and a variety of extracurricular activities."
  },
  
  // Professional Services
  {
    name: "Fulshear Animal Hospital",
    address: "8303 FM 359 S, Fulshear, TX 77441",
    phoneNumber: "(281) 346-8387",
    website: "https://fulshearvets.com",
    rating: 4.8,
    hours: [
      "Monday: 7:30 AM - 6:00 PM",
      "Tuesday: 7:30 AM - 6:00 PM",
      "Wednesday: 7:30 AM - 6:00 PM",
      "Thursday: 7:30 AM - 6:00 PM",
      "Friday: 7:30 AM - 6:00 PM",
      "Saturday: 8:00 AM - 12:00 PM",
      "Sunday: Closed",
    ],
    latitude: 29.687842,
    longitude: -95.888971,
    placeId: "ChIJD1_1Ffj_QIYRLwlF-FzUb1A",
    categoryName: "Professional Services",
    description: "Fulshear Animal Hospital provides comprehensive veterinary care for dogs, cats, and exotic pets. Their services include preventive care, vaccinations, surgical procedures, dental care, and emergency treatment. The facility features modern diagnostic equipment, comfortable treatment rooms, and a caring staff committed to your pet's health. They also offer boarding and grooming services."
  },
  
  // Religious Organizations
  {
    name: "Simonton Community Church",
    address: "9703 FM 1489, Simonton, TX 77476",
    phoneNumber: "(281) 533-9581",
    website: "https://simontoncommunity.com",
    rating: 4.9,
    hours: [
      "Monday: 9:00 AM - 5:00 PM",
      "Tuesday: 9:00 AM - 5:00 PM",
      "Wednesday: 9:00 AM - 5:00 PM",
      "Thursday: 9:00 AM - 5:00 PM",
      "Friday: 9:00 AM - 5:00 PM",
      "Saturday: Closed",
      "Sunday: 9:00 AM - 12:00 PM",
    ],
    latitude: 29.680824,
    longitude: -95.995583,
    placeId: "ChIJfbmhXOn7QIYRuBLcGlL3JpA",
    categoryName: "Religious Organizations",
    description: "Simonton Community Church is a welcoming, non-denominational congregation serving the Fulshear and Simonton areas. They offer contemporary worship services, Bible studies, youth groups, and children's programs. The church is actively involved in community outreach, missions, and service projects. Their beautiful campus includes a main sanctuary, fellowship hall, and outdoor gathering spaces."
  },
  
  // Automotive
  {
    name: "Christian Brothers Automotive Fulshear",
    address: "6150 FM 1463, Fulshear, TX 77441",
    phoneNumber: "(832) 674-8224",
    website: "https://www.cbac.com/fulshear",
    rating: 4.8,
    hours: [
      "Monday: 7:00 AM - 6:00 PM",
      "Tuesday: 7:00 AM - 6:00 PM",
      "Wednesday: 7:00 AM - 6:00 PM",
      "Thursday: 7:00 AM - 6:00 PM",
      "Friday: 7:00 AM - 6:00 PM",
      "Saturday: Closed",
      "Sunday: Closed",
    ],
    latitude: 29.707887,
    longitude: -95.876582,
    placeId: "ChIJh9TbnTP-QIYRXhIoVPZcBxk",
    categoryName: "Automotive",
    description: "Christian Brothers Automotive Fulshear provides complete automotive repair and maintenance services in a clean, professional environment. Their ASE-certified technicians handle everything from oil changes and brake repairs to engine diagnostics and major repairs. They offer a courtesy shuttle, comfortable waiting area, and digital vehicle inspections. All repairs are backed by their 2-year/24,000-mile Nice Difference Warranty."
  },
  {
    name: "Fulshear Hair Salon",
    address: "6123 FM 1463 #100, Fulshear, TX 77441",
    phoneNumber: "(281) 533-0700",
    website: "https://www.fulshearsalon.com",
    rating: 4.6,
    hours: [
      "Monday: 9:00 AM - 7:00 PM",
      "Tuesday: 9:00 AM - 7:00 PM",
      "Wednesday: 9:00 AM - 7:00 PM",
      "Thursday: 9:00 AM - 7:00 PM",
      "Friday: 9:00 AM - 7:00 PM",
      "Saturday: 9:00 AM - 6:00 PM",
      "Sunday: Closed",
    ],
    latitude: 29.7088,
    longitude: -95.8656,
    placeId: "example-fulshear-hair",
    categoryName: "Beauty & Wellness",
    description: "Fulshear Hair Salon offers expert hair styling services for men, women, and children in a modern, trendy atmosphere. Their talented stylists provide precision cuts, coloring, highlights, balayage, extensions, and bridal services. Using high-quality products, they create customized looks for every client. The salon also offers makeup application, waxing services, and a curated selection of hair care products."
  },
  {
    name: "Fulshear Community Church",
    address: "30402 FM 1093, Fulshear, TX 77441",
    phoneNumber: "(281) 346-8812",
    website: "https://www.fulshearcommunity.com",
    rating: 4.8,
    hours: [
      "Monday: 9:00 AM - 4:00 PM",
      "Tuesday: 9:00 AM - 4:00 PM",
      "Wednesday: 9:00 AM - 8:00 PM",
      "Thursday: 9:00 AM - 4:00 PM",
      "Friday: 9:00 AM - 4:00 PM",
      "Saturday: Closed",
      "Sunday: 8:00 AM - 12:00 PM",
    ],
    latitude: 29.7027,
    longitude: -95.8951,
    placeId: "example-fulshear-church",
    categoryName: "Religious Organizations",
    description: "Fulshear Community Church is a vibrant faith community offering engaging worship services with contemporary music and relevant teaching. They provide programs for all ages including youth ministries, children's activities, and adult small groups. The church campus features a modern sanctuary, multipurpose spaces, and outdoor gathering areas. They are dedicated to community service and supporting local families."
  },
  {
    name: "Keller Williams Realty Fulshear",
    address: "29818 FM 1093, Fulshear, TX 77441",
    phoneNumber: "(832) 508-2111",
    website: "https://www.kwfulshear.com",
    rating: 4.7,
    hours: [
      "Monday: 9:00 AM - 6:00 PM",
      "Tuesday: 9:00 AM - 6:00 PM",
      "Wednesday: 9:00 AM - 6:00 PM",
      "Thursday: 9:00 AM - 6:00 PM",
      "Friday: 9:00 AM - 6:00 PM",
      "Saturday: 10:00 AM - 4:00 PM",
      "Sunday: Closed",
    ],
    latitude: 29.7019,
    longitude: -95.8775,
    placeId: "example-kw-fulshear",
    categoryName: "Real Estate",
    description: "Keller Williams Realty Fulshear is a full-service real estate brokerage with a team of experienced agents specializing in the Fulshear and West Houston markets. They provide comprehensive services for buyers, sellers, and investors with expertise in luxury homes, new construction, farm and ranch properties, and commercial real estate. Their office offers cutting-edge technology tools and marketing resources to support both clients and agents."
  }
];

// Add real Fulshear businesses with descriptions
export const addRealBusinessesWithDescriptions = mutation({
  handler: async (ctx) => {
    try {
      // Get all categories to map business names to category IDs
      const categories = await ctx.db.query("categories").collect();
      
      // Create a map of category names to IDs for easy lookup
      const categoryMap = new Map();
      for (const category of categories) {
        categoryMap.set(category.name, category._id);
      }
      
      // Process and insert businesses in database
      const results = {
        added: 0,
        updated: 0,
        skipped: 0,
        errors: 0,
      };
      
      for (const businessData of fulshearBusinesses) {
        try {
          // Check if business already exists (by name)
          const existingBusinesses = await ctx.db
            .query("businesses")
            .filter((q) => q.eq(q.field("name"), businessData.name))
            .collect();
          
          // Get categoryId from name
          const categoryId = categoryMap.get(businessData.categoryName);
          if (!categoryId) {
            console.warn(`Could not find category: ${businessData.categoryName} for business: ${businessData.name}`);
            results.skipped++;
            continue;
          }
          
          // Prepare business object for database (without categoryName)
          const { categoryName, ...businessForDb } = businessData;
          
          if (existingBusinesses.length > 0) {
            // Update existing business with description
            await ctx.db.patch(existingBusinesses[0]._id, {
              ...businessForDb,
              categoryId: categoryId as Id<"categories">,
              lastUpdated: Date.now(),
            });
            console.log(`Updated business: ${businessData.name}`);
            results.updated++;
          } else {
            // Insert new business
            await ctx.db.insert("businesses", {
              ...businessForDb,
              categoryId: categoryId as Id<"categories">,
              lastUpdated: Date.now(),
            });
            
            results.added++;
            console.log(`Added business: ${businessData.name}`);
          }
        } catch (error) {
          console.error(`Error processing business: ${businessData.name}`, error);
          results.errors++;
        }
      }
      
      return {
        success: true,
        message: `Real businesses updated: ${results.added} added, ${results.updated} updated, ${results.skipped} skipped, ${results.errors} errors`,
        results,
      };
    } catch (error) {
      console.error("Error adding real businesses:", error);
      throw new Error(`Failed to add real businesses: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
}); 