// Google Places API utility functions for Convex backend

/**
 * Fetch businesses in Fulshear, TX from Google Places API
 * @param apiKey Google Places API key
 * @returns Processed business data ready for insertion into the database
 */
export async function fetchFulshearBusinesses(apiKey: string) {
  if (!apiKey) {
    throw new Error("Google Places API key is required");
  }

  // Fulshear, TX coordinates
  const location = "29.6936,-95.8883"; // Latitude,Longitude
  const radius = 5000; // 5km radius (covers most of Fulshear)
  
  // Step 1: First search to get place IDs - do multiple searches for different types
  const businessTypes = [
    "restaurant", "cafe", "bakery", "bar", // Food
    "store", "clothing_store", "supermarket", "shopping_mall", // Shopping
    "school", "university", "library", // Education
    "doctor", "dentist", "hospital", "pharmacy", // Medical
    "real_estate_agency", "home_goods_store", // Real estate & home
    "park", "gym", "amusement_park", "movie_theater", // Recreation
    "lawyer", "accounting", "insurance_agency", // Professional services
    "hair_care", "beauty_salon", "spa", // Beauty
    "car_dealer", "car_wash", "car_repair", // Automotive
    "church", "place_of_worship", // Religious
    "bank", "atm", // Financial
  ];
  
  const results: Array<{
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phoneNumber: string | null;
    website: string | null;
    rating: number | null;
    types: string[];
    hours: string[];
    placeId: string;
  }> = [];
  
  // Process each business type
  for (const type of businessTypes) {
    try {
      console.log(`Fetching businesses of type: ${type}`);
      
      const placesUrl = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
      placesUrl.searchParams.append("location", location);
      placesUrl.searchParams.append("radius", radius.toString());
      placesUrl.searchParams.append("type", type);
      placesUrl.searchParams.append("key", apiKey);
      
      const response = await fetch(placesUrl.toString());
      
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        throw new Error(`Google Places API error for type ${type}: ${data.status}`);
      }
      
      if (data.results && data.results.length > 0) {
        console.log(`Found ${data.results.length} businesses of type: ${type}`);
        
        // Only process up to 5 businesses per type to avoid API quota issues
        for (const place of data.results.slice(0, 5)) {
          try {
            // Check if we already fetched this place
            if (!results.some(r => r.placeId === place.place_id)) {
              const details = await fetchPlaceDetails(place.place_id, apiKey);
              results.push(details);
            }
          } catch (error) {
            console.error(`Error fetching details for ${place.name}:`, error);
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching businesses of type ${type}:`, error);
    }
  }
  
  return results;
}

/**
 * Fetch detailed information for a specific place
 * @param placeId Google Place ID
 * @param apiKey Google Places API key
 * @returns Processed place details
 */
async function fetchPlaceDetails(placeId: string, apiKey: string) {
  const detailsUrl = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  detailsUrl.searchParams.append("place_id", placeId);
  detailsUrl.searchParams.append("fields", "name,formatted_address,geometry,website,formatted_phone_number,opening_hours,rating,types");
  detailsUrl.searchParams.append("key", apiKey);
  
  const response = await fetch(detailsUrl.toString());
  
  if (!response.ok) {
    throw new Error(`Google Places Details API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (data.status !== "OK") {
    throw new Error(`Google Places Details API error: ${data.status}`);
  }
  
  const result = data.result;
  
  // Map Google Places data to our database schema
  return {
    name: result.name,
    address: result.formatted_address,
    latitude: result.geometry.location.lat,
    longitude: result.geometry.location.lng,
    phoneNumber: result.formatted_phone_number || null,
    website: result.website || null,
    rating: result.rating || null,
    types: result.types || [],
    hours: result.opening_hours?.weekday_text || [],
    placeId: placeId, // Store the place ID for future reference
  };
}

/**
 * Map Google Places business types to our category IDs
 * @param types Google Places business types
 * @param categoryMap Map of category names to category IDs
 * @returns Best matching category ID
 */
export function mapBusinessTypeToCategory(
  types: string[], 
  categoryMap: Map<string, string>
): string | null {
  // Priority ordered business types and their corresponding categories
  const typeToCategory: Record<string, string> = {
    // Restaurants
    'restaurant': 'Restaurants',
    'food': 'Restaurants',
    'cafe': 'Restaurants',
    'bakery': 'Restaurants',
    'bar': 'Restaurants',
    'meal_delivery': 'Restaurants',
    'meal_takeaway': 'Restaurants',
    
    // Shopping
    'store': 'Shopping',
    'shop': 'Shopping',
    'shopping_mall': 'Shopping',
    'clothing_store': 'Shopping',
    'supermarket': 'Shopping',
    'grocery_or_supermarket': 'Shopping',
    'home_goods_store': 'Shopping',
    'furniture_store': 'Shopping',
    'book_store': 'Shopping',
    'electronics_store': 'Shopping',
    
    // Childcare & Education
    'school': 'Childcare & Education',
    'university': 'Childcare & Education',
    'library': 'Childcare & Education',
    'primary_school': 'Childcare & Education',
    'secondary_school': 'Childcare & Education',
    'day_care': 'Childcare & Education',
    'kindergarten': 'Childcare & Education',
    
    // Medical & Dental
    'hospital': 'Medical & Dental',
    'doctor': 'Medical & Dental',
    'dentist': 'Medical & Dental',
    'pharmacy': 'Medical & Dental',
    'physiotherapist': 'Medical & Dental',
    'health': 'Medical & Dental',
    'veterinary_care': 'Medical & Dental',
    'medical_service': 'Medical & Dental',
    
    // Real Estate
    'real_estate_agency': 'Real Estate',
    'home_builder': 'Real Estate',
    'roofing_contractor': 'Home Services', // Changed to avoid duplicate
    'lodging': 'Real Estate',
    
    // Recreation & Entertainment
    'amusement_park': 'Recreation & Entertainment',
    'movie_theater': 'Recreation & Entertainment',
    'stadium': 'Recreation & Entertainment',
    'park': 'Recreation & Entertainment',
    'tourist_attraction': 'Recreation & Entertainment',
    'zoo': 'Recreation & Entertainment',
    'bowling_alley': 'Recreation & Entertainment',
    'night_club': 'Recreation & Entertainment',
    
    // Professional Services
    'lawyer': 'Professional Services',
    'accounting': 'Professional Services',
    'insurance_agency': 'Professional Services',
    'post_office': 'Professional Services',
    'travel_agency': 'Professional Services',
    // Removed duplicate real_estate_agency
    
    // Home Services
    'plumber': 'Home Services',
    'electrician': 'Home Services',
    'locksmith': 'Home Services',
    'moving_company': 'Home Services',
    'storage': 'Home Services',
    'painter': 'Home Services',
    'general_contractor': 'Home Services',
    // Removed duplicate roofing_contractor
    
    // Beauty & Wellness
    'beauty_salon': 'Beauty & Wellness',
    'hair_care': 'Beauty & Wellness',
    'spa': 'Beauty & Wellness',
    'gym': 'Sports & Fitness', // Changed to avoid duplicate
    'health_and_beauty': 'Beauty & Wellness',
    
    // Financial Services
    'bank': 'Financial Services',
    'atm': 'Financial Services',
    'finance': 'Financial Services',
    // Removed duplicate accounting
    // Removed duplicate insurance_agency
    
    // Religious Organizations
    'church': 'Religious Organizations',
    'hindu_temple': 'Religious Organizations',
    'mosque': 'Religious Organizations',
    'synagogue': 'Religious Organizations',
    'place_of_worship': 'Religious Organizations',
    
    // Sports & Fitness
    // Removed duplicate gym
    // Removed duplicate stadium
    'sports_club': 'Sports & Fitness',
    
    // Automotive
    'car_dealer': 'Automotive',
    'car_rental': 'Automotive',
    'car_repair': 'Automotive',
    'car_wash': 'Automotive',
    'gas_station': 'Automotive',
  };
  
  // Try to find a matching category
  for (const type of types) {
    const categoryName = typeToCategory[type];
    if (categoryName && categoryMap.has(categoryName)) {
      const categoryId = categoryMap.get(categoryName);
      if (categoryId) {
        return categoryId;
      }
    }
  }
  
  // Default to the first category if no match found
  const firstCategory = categoryMap.size > 0 ? Array.from(categoryMap.values())[0] : null;
  return firstCategory;
} 