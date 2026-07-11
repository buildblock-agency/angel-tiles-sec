import { MetadataRoute } from 'next';
import { PRODUCTS, CATEGORIES } from '@/content/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://angeltilesandstone.com';

  // 1. Static Core Pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/visualize`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
  ];

  // 2. Category Pages (Marble, Granite, Tiles, Sanitaryware)
  const categoryPages = Object.keys(CATEGORIES).map((cat) => ({
    url: `${baseUrl}/collections/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 3. Product Pages
  const productPages = PRODUCTS.map((prod) => ({
    url: `${baseUrl}/products/${prod.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
