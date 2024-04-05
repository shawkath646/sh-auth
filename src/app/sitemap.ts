import { MetadataRoute } from 'next';

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
      url: "https://sh-authentication-system.vercel.app/privacy-policy",
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: "https://sh-authentication-system.vercel.app/auth/profile/general",
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: "https://sh-authentication-system.vercel.app/auth/profile/enterprise",
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: "https://sh-authentication-system.vercel.app/auth/profile/security",
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: "https://sh-authentication-system.vercel.app/auth/profile/application",
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: "https://sh-authentication-system.vercel.app/auth/profile/address",
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: "https://sh-authentication-system.vercel.app/auth/profile/permissions",
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: "https://sh-authentication-system.vercel.app/auth/profile/logout",
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.8
    },
  ];
}