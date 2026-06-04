import { getAllPosts } from '@/lib/data';
import { SITE_HOST, SITE_NAME } from '@/lib/constants';
import {
  HTML_LANG,
  Locale,
  getMessages,
  homePathFor,
  localePath,
  postPathFor,
} from '@/lib/i18n';

const MAX_FEED_ITEMS = 20;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function feedPathFor(locale: Locale): string {
  return localePath(locale, '/feed.xml');
}

export function generateRssFeed(locale: Locale): string {
  const t = getMessages(locale);
  const posts = getAllPosts(locale).slice(0, MAX_FEED_ITEMS);
  const feedUrl = `${SITE_HOST}${feedPathFor(locale)}`;
  const siteUrl = `${SITE_HOST}${homePathFor(locale)}`;
  const buildDate = new Date().toUTCString();

  const items = posts.map((post) => {
    const url = `${SITE_HOST}${postPathFor(locale, post.slug)}`;
    const pubDate = new Date(post.date).toUTCString();
    const categories = post.topics
      .map((topic) => `      <category>${escapeXml(topic)}</category>`)
      .join('\n');
    return [
      '    <item>',
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${pubDate}</pubDate>`,
      `      <description>${escapeXml(post.description)}</description>`,
      categories,
      '    </item>',
    ]
      .filter((line) => line.length > 0)
      .join('\n');
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(t.siteDescription)}</description>
    <language>${HTML_LANG[locale]}</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`;
}
