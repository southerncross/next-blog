import { Post } from "@/interfaces/post";
import { Comment } from "@/interfaces/comment";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import { sql } from "@vercel/postgres";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export async function getCommentsBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const data = await sql<{
    id: string;
    slug: string;
    content: string;
    created_at: string;
  }>`
    SELECT id, slug, content, created_at
    FROM comments WHERE slug = ${realSlug} ORDER BY created_at DESC
  `;

  const comments = data.rows.map((row) => {
    return {
      id: row.id,
      slug: row.slug,
      content: row.content,
      createdAt: row.created_at,
    } as Comment;
  });

  return comments;
}
