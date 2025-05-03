# Environment Variables Setup

To set up your environment variables for the Fulshear Local project, create a `.env.local` file in the root directory with the following variables:

## Required Environment Variables

```
# Convex credentials
# These are usually automatically generated when you run npx convex dev
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

# Google Maps API key
# Replace with your actual API key (the one you provided has been redacted for security)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyABzht1PL3Ze8HIYQLmualN-fM800vw_HI

# Admin key for data refresh operations
# Change this to a secure value in production
ADMIN_KEY=admin_secret_key
```

## Security Notes

- **IMPORTANT**: Never commit your `.env.local` file to version control
- Make sure `.env.local` is included in your `.gitignore` file
- For production, set these environment variables in your hosting platform (e.g., Vercel)
- Rotate your API keys regularly for better security 