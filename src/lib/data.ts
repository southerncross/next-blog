import { Post } from '@/interfaces/post';
import { Comment } from '@/interfaces/comment';
import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';
import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';

const postsDirectory = join(process.cwd(), '_posts');

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  if (!fs.existsSync(fullPath)) {
    notFound();
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
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
