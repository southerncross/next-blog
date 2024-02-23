"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

const CreateComment = z.object({
  slug: z.string(),
  content: z.string(),
});
export async function createComment(slug: string, content: string) {
  CreateComment.parse({ slug, content });

  await sql`
    INSERT INTO comments (slug, content)
    VALUES (${slug}, ${content})
  `;

  revalidatePath(`/posts/${slug}`);
}

const DeleteComment = z.object({
  id: z.string(),
  slug: z.string(),
});
export async function deleteComment(id: string, slug: string) {
  DeleteComment.parse({ id, slug });

  await sql`DELETE FROM comments WHERE id = ${id} AND slug=${slug}`;

  revalidatePath(`/posts/${slug}`);
}
