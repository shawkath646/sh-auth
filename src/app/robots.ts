import { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/auth',
    },
    sitemap: `${process.env.APP_BASE_URL}/sitemap.xml`,
  }
};