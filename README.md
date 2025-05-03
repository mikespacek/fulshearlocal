# Fulshear Local Business Directory

A modern, fast business directory website for Fulshear, TX that stores business data in a database for efficient access rather than repeatedly calling the Google Places API.

## Features

- **Fast Business Directory**: Search and browse local businesses in Fulshear, TX
- **Cached Data**: Business information is stored in Convex, not fetched from Google Places API on every request
- **Search & Filtering**: Filter businesses by name or category
- **Interactive Map**: View all business locations on a map with Google Maps integration
- **Detailed Business Pages**: View full information for each business
- **Admin Refresh**: Trigger a manual refresh of business data from Google Places API
- **Responsive Design**: Works beautifully on all devices

## Tech Stack

- **Frontend**: React with Next.js (App Router)
- **Styling**: Tailwind CSS with ShadCN UI components
- **Database**: Convex (Backend as a Service)
- **Mapping**: Google Maps JavaScript API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Convex account
- Google Maps API key

### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/fulshear-local.git
cd fulshear-local
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy the `ENV_EXAMPLE` file and create a `.env.local` file:

```bash
cp ENV_EXAMPLE .env.local
```

Then edit the `.env.local` file with your actual values:

```
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
ADMIN_KEY=your_admin_secret_key_for_refreshing_data
```

4. **Initialize Convex**

```bash
npx convex dev
```

This will create a development Convex deployment. Follow the prompts to set up your project.

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app`: Next.js app router pages
- `/components`: React components
- `/convex`: Convex backend code
  - `schema.ts`: Database schema
  - `businesses.ts`: Business data queries
  - `categories.ts`: Category data queries
  - `refreshData.ts`: Data refresh mutation
- `/types`: TypeScript type declarations

## Deployment

### Quick Deployment

We've included a deployment script that helps prepare and deploy your application:

```bash
# Run deployment preparation (linting, building, etc.)
./deploy.sh

# Deploy directly to Vercel using the Vercel CLI
./deploy.sh --vercel-cli
```

### Detailed Deployment Instructions

For detailed deployment instructions, see the [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) file, which includes:

- Step-by-step instructions for deploying using Vercel CLI
- Instructions for deploying via Vercel web interface
- Setting up environment variables
- Connecting Convex to production
- Troubleshooting common issues

### Key Deployment Steps

1. **Prepare environment variables**
   - Set up your Convex deployment URL
   - Add your Google Maps API key
   - Configure your admin key

2. **Deploy Convex functions**
   ```bash
   npx convex deploy
   ```

3. **Deploy to Vercel**
   - Using the web interface or
   - Using the Vercel CLI:
     ```bash
     vercel
     vercel --prod # For production
     ```

4. **Seed your database**
   ```bash
   npm run seed
   ```

## Data Seed Process

The application includes a seed script that populates the database with sample data:

```bash
npm run seed
```

In a production environment, you would implement:
1. A complete Google Places API integration in the `refreshData.ts` file
2. A proper admin authentication system instead of the simple key-based auth

## Troubleshooting

If you encounter any issues during deployment or with the application:

1. Check the console for error messages
2. Ensure all environment variables are correctly set
3. Check that your Google Maps API key has the correct permissions
4. Verify your Convex deployment URL is correct

## License

This project is licensed under the MIT License.
