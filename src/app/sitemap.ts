import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
        url: "https://sh-authentication-system.vercel.app",
        changeFrequency: "never",
        lastModified: new Date(),
        priority: 1
    },
    {
        url: "https://sh-authentication-system.vercel.app/sign-in",
        changeFrequency: "never",
        lastModified: new Date(),
        priority: 0.8
    },
    {
        url: "https://sh-authentication-system.vercel.app/sign-up",
        changeFrequency: "never",
        lastModified: new Date(),
        priority: 0.8
    },
    {
        url: "https://sh-authentication-system.vercel.app/auth/profile",
        changeFrequency: "never",
        lastModified: new Date(),
        priority: 0.8
    },
    {
        url: "https://sh-authentication-system.vercel.app/profile/applications",
        changeFrequency: "daily",
        lastModified: new Date(),
        priority: 0.8
    },
    {
        url: "https://sh-authentication-system.vercel.app/profile/create-new",
        changeFrequency: "never",
        lastModified: new Date(),
        priority: 0.8
    },
  ];
}