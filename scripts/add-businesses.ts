import { ConvexHttpClient } from "convex/browser";
import dotenv from "dotenv";
import { api } from "../convex/_generated/api";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Process command line arguments
const args = process.argv.slice(2);
const adminKeyFlag = args.find(arg => arg.startsWith('--adminKey='));
const adminKey = adminKeyFlag ? adminKeyFlag.split('=')[1] : process.env.ADMIN_KEY;

// Initialize the Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://rosy-cow-217.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

async function addBusinesses() {
  try {
    // Check for required environment variables
    if (!convexUrl) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is required in .env.local or as a command line argument");
    }
    
    if (!adminKey) {
      throw new Error("ADMIN_KEY is required in .env.local or as a command line argument (--adminKey=your_key)");
    }

    console.log("Adding businesses to empty categories...");
    console.log(`Using Convex URL: ${convexUrl}`);
    
    // Call the mutation function
    const result = await convex.mutation(api.addMissingBusinesses.addBusinessesToEmptyCategories, {
      adminKey: adminKey
    });
    
    console.log("Result:", result);
    console.log("Successfully added businesses to empty categories!");
  } catch (error) {
    console.error("Error adding businesses:", error);
    process.exit(1);
  }
}

// Run the function
addBusinesses(); 