"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { getSession } from '@auth0/nextjs-auth0';

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
