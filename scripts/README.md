# Fulshear Business Directory - Data Import Tools

This directory contains scripts to help populate the Fulshear business directory with data from various sources.

## Prerequisites

Before using these scripts, make sure you have:

1. Node.js installed (v14 or later)
2. A Google Maps API key with Places API enabled
3. Convex backend deployed and configured

## Available Scripts

### 1. Direct Category-Specific Additions

These scripts add predefined businesses to specific categories:

- `add-retail-businesses.sh`: Adds retail businesses
- `add-services-businesses.sh`: Adds service businesses
- `add-more-businesses.sh`: Adds businesses to healthcare, education, and entertainment categories

Usage:
```bash
./add-retail-businesses.sh
./add-services-businesses.sh
./add-more-businesses.sh
```

### 2. Google Maps API Business Import

#### Generate Business Data from Google Maps

This script fetches business data from Google Maps for all categories:

```bash
# Install dependencies
npm install --save-dev dotenv convex

# Run the script (requires Google Maps API key)
node generate-all-category-businesses.js YOUR_GOOGLE_API_KEY
```

The script will:
- Search for businesses in Fulshear across all categories
- Filter results to include only Fulshear businesses
- Fetch detailed information for each business
- Save data to `data/fulshear-businesses.json`

#### Import Generated Business Data to Convex

After generating the JSON file, import the data to your Convex database:

```bash
node import-generated-businesses.js [path/to/data.json]
```

If you don't specify a path, it uses the default `data/fulshear-businesses.json` file.

### 3. Direct Convex API Import

For direct integration with the Convex backend:

```bash
# Run with your Google Maps API key
./import-google-businesses.sh YOUR_GOOGLE_API_KEY [ADMIN_KEY]
```

### 4. Running the Convex Import Function

You can also directly call the Convex function:

```bash
# Call the mutation directly
npx convex run -f importGooglePlaces:importFulshearBusinesses '{"googleApiKey":"YOUR_GOOGLE_API_KEY", "deleteExisting": false, "daysToLookBack": 365}'
```

## Troubleshooting

- **API Key Issues**: Make sure your Google API key has Places API enabled and has sufficient quota
- **Database Errors**: Check the Convex dashboard for logs (`npx convex dashboard`)
- **Duplicate Businesses**: The scripts check for existing place IDs to avoid duplicates
- **TypeScript Errors**: You may need to fix type issues in `addMissingBusinesses.ts` if you see errors

## Notes

- The Google Maps API has rate limits, so the scripts include delays between requests
- For large imports, consider running in batches to avoid hitting API quotas
- If you're testing, set `deleteExisting` to `false` to preserve existing data

## Environment Setup

Make sure your `.env.local` file contains:

```
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
GOOGLE_PLACES_API_KEY=your_google_maps_api_key
ADMIN_KEY=your_admin_secret_key
``` 