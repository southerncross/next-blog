import { Post } from '@/interfaces/post';
import { Comment } from '@/interfaces/comment';
import { DEFAULT_LOCALE, LOCALES, Locale } from '@/lib/i18n';
import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';
import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';

const postsDirectory = join(process.cwd(), '_posts');

const LOCALE_SUFFIXES = LOCALES.map((locale) => `.${locale}.md`);

function listMarkdownFiles(): string[] {
  return fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'));
}

export function getPostSlugs(): string[] {
  const slugs = new Set<string>();
  for (const file of listMarkdownFiles()) {
    const localeSuffix = LOCALE_SUFFIXES.find((suffix) =>
      file.endsWith(suffix),
    );
    if (localeSuffix) {
      slugs.add(file.slice(0, -localeSuffix.length));
    } else {
      slugs.add(file.slice(0, -'.md'.length));
    }
  }
  return Array.from(slugs);
}

function fileForLocale(slug: string, locale: Locale): string | null {
  const filename =
    locale === DEFAULT_LOCALE ? `${slug}.md` : `${slug}.${locale}.md`;
  const fullPath = join(postsDirectory, filename);
  return fs.existsSync(fullPath) ? fullPath : null;
}

function getAvailableLocales(slug: string): Locale[] {
  return LOCALES.filter((l) => fileForLocale(slug, l) !== null);
}

export function getPostBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Post {
  const realSlug = slug.replace(/\.md$/, '');

  let actualLocale: Locale = locale;
  let path = fileForLocale(realSlug, locale);

  if (!path && locale !== DEFAULT_LOCALE) {
    path = fileForLocale(realSlug, DEFAULT_LOCALE);
    actualLocale = DEFAULT_LOCALE;
  }

  if (!path) {
    notFound();
  }

  const fileContents = fs.readFileSync(path, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    ...(data as Pick<Post, 'title' | 'date' | 'preview'>),
    slug: realSlug,
    content,
    locale: actualLocale,
    requestedLocale: locale,
    isFallback: actualLocale !== locale,
    availableLocales: getAvailableLocales(realSlug),
  } as Post;
}

export function getAllPosts(locale: Locale = DEFAULT_LOCALE): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, locale))
    .filter((post) => process.env.PREVIEW_MODE || !post.preview)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export async function getCommentsBySlug(slug: string) {
  try {
    const realSlug = slug.replace(/\.md$/, '');
    const data = await sql<{
      id: string;
      slug: string;
      content: string;
      created_at: Date;
      author_sub: string;
      author_name: string;
      author_picture: string;
    }>`
    SELECT
      c.id AS id,
      c.slug AS slug,
      c.content AS content,
      c.created_at AS created_at,
      c.author_sub AS author_sub,
      u.name AS author_name,
      u.picture AS author_picture
    FROM comments AS c
    JOIN users AS u ON u.sub = c.author_sub
    WHERE c.slug = ${realSlug} ORDER BY c.created_at ASC
  `;

    const comments = data.rows.map((row) => {
      return {
        id: row.id,
        slug: row.slug,
        content: row.content,
        author: {
          sub: row.author_sub,
          name: row.author_name,
          picture: row.author_picture,
        },
        createdAt: row.created_at,
      } as Comment;
    });

    return comments;
  } catch (e) {
    console.error(e);
    return [];
  }
}
