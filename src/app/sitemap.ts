import type { MetadataRoute } from 'next';
import { SITE_HOST } from '@/lib/constants';
import { getAllPosts } from '@/lib/data';
import { LOCALES, homePathFor, postPathFor } from '@/lib/i18n';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const postEntries: MetadataRoute.Sitemap = [];
  let latest = new Date(0);

  for (const locale of LOCALES) {
    for (const post of getAllPosts(locale)) {
      if (post.locale !== locale) continue;
      const lastModified = new Date(post.date);
      if (lastModified > latest) latest = lastModified;
      postEntries.push({
        url: `${SITE_HOST}${postPathFor(locale, post.slug)}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  const homeEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${SITE_HOST}${homePathFor(locale)}`,
    lastModified: latest,
    changeFrequency: 'weekly',
    priority: 1,
  }));

  return [...homeEntries, ...postEntries];
}
