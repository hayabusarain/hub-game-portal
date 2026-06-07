import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hub-game.com';
  const locales = ['ja', 'en'];

  // Define active static paths (without locale prefix)
  const staticPaths = [
    '',
    '/contact',
    '/disclaimer',
    '/privacy',
    '/terms',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    const isHome = path === '';
    
    // Generate alternates languages object
    const alternatesLanguages: Record<string, string> = {};
    for (const l of locales) {
      alternatesLanguages[l] = `${baseUrl}/${l}${path}`;
    }
    
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: isHome ? 'weekly' : 'monthly',
        priority: isHome ? 1.0 : 0.8,
        alternates: {
          languages: alternatesLanguages
        }
      });
    }
  }

  return sitemapEntries;
}
