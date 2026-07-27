import type { MetadataRoute } from 'next';
import { SITE_HOST } from '@/lib/constants';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_HOST}/sitemap.xml`,
    host: SITE_HOST,
  };
}
