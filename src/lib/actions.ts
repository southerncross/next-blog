"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { getSession } from '@auth0/nextjs-auth0';

import { Reaction } from "@/interfaces/reaction";

const CreateComment = z.object({
  slug: z.string(),
  content: z.string().max(4096),
});
export async function createComment(
  slug: string,
  content: string,
) {
  CreateComment.parse({ slug, content });

  const { user } = await getSession() || {};
  if (!user) {
    throw new Error("Unauthorized");
  }

  await sql`
    INSERT INTO comments (slug, content, author_sub)
    VALUES (${slug}, ${content}, ${user.sub})
  `;

  await sql`
    INSERT INTO users (sub, name, picture)
    VALUES (${user.sub}, ${user.name}, ${user.picture})
    ON CONFLICT (sub) DO UPDATE SET
      name = ${user.name},
      picture = ${user.picture}
  `;

  revalidatePath(`/posts/${slug}`);
}

const DeleteComment = z.object({
  id: z.string(),
  slug: z.string(),
});
export async function deleteComment(id: string, slug: string) {
  DeleteComment.parse({ id, slug });

  const { user } = await getSession() || {};
  if (!user) {
    throw new Error("Unauthorized");
  }

  await sql`
    DELETE FROM comments
    WHERE id = ${id} AND slug=${slug} AND author_sub=${user.sub}
  `;

  revalidatePath(`/posts/${slug}`);
}

const GetReactionsBySlug = z.object({
  slug: z.string(),
});
export async function getReactionsBySlug(slug: string) {
  GetReactionsBySlug.parse({ slug });

  try {
    const realSlug = slug.replace(/\.md$/, "");
    const data = await sql<{
      emoji: string;
      count: number;
      slug: string;
    }>`
    SELECT emoji, count, slug
    FROM reactions
    WHERE slug = ${realSlug} ORDER BY created_at DESC
  `;

    const reactions = data.rows.map((row) => {
      return {
        emoji: row.emoji,
        count: row.count,
        slug: row.slug,
      } as Reaction;
    });

    const defaultEmojis = ['👍', '❤️', '🤔', '🤡'];
    const savedEmojiSet = new Set(reactions.map((x) => x.emoji));

    defaultEmojis.reverse().filter((x) => !savedEmojiSet.has(x))
    .forEach((emoji) => {
      reactions.unshift({
        emoji,
        count: 0,
        slug: realSlug,
      });
    });

    return reactions;
  } catch (e) {
    console.error(e);
    return [];
  }
}

const AddReaction = z.object({
  emoji: z.string(),
  slug: z.string(),
});
export async function addReaction(emoji: string, slug: string) {
  AddReaction.parse({ emoji, slug });

  await sql`
    INSERT INTO reactions (emoji, slug, count)
    VALUES (${emoji}, ${slug}, 1)
    ON CONFLICT (emoji, slug)
    DO UPDATE SET count = reactions.count + 1
  `;

  revalidatePath(`/posts/${slug}`);
}
