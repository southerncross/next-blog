import CommentForm from "./comment-form";
import CommentItem from "./comment-item";
import { getCommentsBySlug } from "@/lib/data";

export default async function Comments({ slug }: { slug: string }) {
  const comments = await getCommentsBySlug(slug);

  return (
    <section className="my-8">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
        Comments
      </h2>
      {comments.length > 0 ? (
        <ul className="mb-12">
          {comments.map((comment) => (
            <li key={comment.id}>
              <CommentItem comment={comment} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="ml-6 mb-12 text-center md:text-left">No comments yet.</p>
      )}
      <CommentForm slug={slug} />
    </section>
  );
}
