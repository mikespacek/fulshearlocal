import { action } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

interface UpdateResults {
  success: boolean;
  message: string;
  updated: number;
  failed: number;
  totalProcessed: number;
}

/**
 * Action to update photos for existing businesses that don't have photos
 * This is useful for fixing businesses with missing photos
 */
export const updateBusinessPhotos = action({
  args: {
    googleApiKey: v.string(),
    businessIds: v.optional(v.array(v.string())), // Optional list of business IDs to update
  },
  handler: async (ctx, args): Promise<UpdateResults> => {
    const googleApiKey = args.googleApiKey;
    const specificBusinessIds = args.businessIds?.map(id => id as Id<"businesses">);
    
    try {
      // Get businesses to update - either specific ones or all without photos
      let businesses;
      
      if (specificBusinessIds && specificBusinessIds.length > 0) {
        // Get only the specified businesses
        businesses = [];
        for (const id of specificBusinessIds) {
          const business = await ctx.runQuery(api.businesses.getById, { id });
          if (business) businesses.push(business);
        }
        console.log(`Found ${businesses.length} specified businesses to update`);
      } else {
        // Get all businesses
        businesses = await ctx.runQuery(api.businesses.getAll);
        
        // Filter for those without photos
        businesses = businesses.filter(b => !b.photos || b.photos.length === 0);
        console.log(`Found ${businesses.length} businesses without photos`);
      }
      
      const results = {
        updated: 0,
        failed: 0,
        totalProcessed: 0,
      };
      
      // Process each business
      for (const business of businesses) {
        try {
          // Skip businesses without placeId
          if (!business.placeId) {
            console.log(`Business ${business.name} has no placeId, skipping`);
            continue;
          }
          
          results.totalProcessed++;
          console.log(`Processing ${business.name} (${results.totalProcessed}/${businesses.length})`);
          
          // Get place details with photos
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${business.placeId}&fields=photos,profile_photo_reference&key=${googleApiKey}`;
          
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();
          
          if (!detailsResponse.ok || detailsData.status !== "OK") {
            console.error(`Place details API error for ${business.name}: ${detailsData.status}`, detailsData.error_message);
            results.failed++;
            continue;
          }
          
          const placeDetails = detailsData.result;
          
          // Process photos
          let photos: string[] = [];
          if (placeDetails.photos && placeDetails.photos.length > 0) {
            try {
              // Get photo references and convert to URLs
              const photoReferences = placeDetails.photos.slice(0, 10).map((photo: any) => photo.photo_reference);
              
              photos = photoReferences.map((ref: string) => 
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${ref}&key=${googleApiKey}`
              );
              
              // If profile photo exists, prioritize it
              if (placeDetails.profile_photo_reference) {
                photos.unshift(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${placeDetails.profile_photo_reference}&key=${googleApiKey}`);
                photos = [...new Set(photos)].slice(0, 10);
              }
              
              // Update business with new photos
              await ctx.runMutation(api.businesses.update, { 
                id: business._id,
                updates: { photos }
              });
              
              results.updated++;
              console.log(`Updated photos for ${business.name}: ${photos.length} photos added`);
            } catch (photoError) {
              console.error(`Error processing photos for ${business.name}:`, photoError);
              results.failed++;
            }
          } else {
            console.log(`No photos available for ${business.name}`);
            results.failed++;
          }
        } catch (error) {
          console.error(`Error updating photos for ${business.name}:`, error);
          results.failed++;
        }
      }
      
      return {
        success: true,
        message: `Photo update completed: ${results.updated} updated, ${results.failed} failed`,
        updated: results.updated,
        failed: results.failed,
        totalProcessed: results.totalProcessed
      };
    } catch (error) {
      console.error("Photo update error:", error);
      throw new Error(`Failed to update photos: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
}); 