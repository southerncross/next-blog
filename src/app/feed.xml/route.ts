import { generateRssFeed } from '@/lib/rss';

export const dynamic = 'force-static';

export async function GET() {
  const body = generateRssFeed('zh');
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
