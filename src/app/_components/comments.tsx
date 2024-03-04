import CommentForm from './comment-form';
import CommentItem from './comment-item';
import { getCommentsBySlug } from '@/lib/data';

export default async function Comments({ slug }: { slug: string }) {
  const comments = await getCommentsBySlug(slug);

  return (
    <section className="my-8">
      <h2 className="mb-12 text-center text-4xl font-bold leading-tight tracking-tighter md:text-5xl md:leading-none lg:text-6xl">
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
        <p className="mb-12 ml-6 text-center md:text-left">No comments yet.</p>
      )}
      <CommentForm slug={slug} />
    </section>
  );
}
