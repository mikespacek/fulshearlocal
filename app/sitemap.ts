import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fulshearlocal.com';
  
  // Static routes - only include public-facing pages
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Category routes - in a real app, you'd fetch these from your database
  const categories = [
    'restaurants', 'shopping', 'services', 'healthcare', 
    'entertainment', 'realestate', 'automotive', 'education'
  ];
  
  const categoryRoutes = categories.map(category => ({
    url: `${baseUrl}/categories/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Sample business routes (in production, these would be generated from your database)
  // This ensures search engines discover your business detail pages
  const sampleBusinessIds = [
    'businesses_1', 'businesses_2', 'businesses_3',
    'businesses_4', 'businesses_5', 'businesses_6'
  ];
  
  const businessRoutes = sampleBusinessIds.map(id => ({
    url: `${baseUrl}/business/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...categoryRoutes, ...businessRoutes];
} 