import CommentForm from './comment-form';
import CommentItem from './comment-item';
import { getCommentsBySlug } from '@/lib/data';

export default async function Comments({ slug }: { slug: string }) {
  const comments = await getCommentsBySlug(slug);

  return (
    <section className="mt-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="label-mono">— Comments</span>
          <h2 className="mt-3 text-h2 font-semibold tracking-tighter text-ink dark:text-carbon-text">
            Discussion
          </h2>
        </div>
        <span className="label-mono">
          {comments.length} {comments.length === 1 ? 'reply' : 'replies'}
        </span>
      </div>
      {comments.length > 0 ? (
        <ul className="mb-10 divide-y divide-outline-subtle border-y border-outline-subtle dark:divide-carbon-border dark:border-carbon-border">
          {comments.map((comment) => (
            <li key={comment.id}>
              <CommentItem comment={comment} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-10 border-y border-outline-subtle py-8 text-sm text-ink-muted dark:border-carbon-border dark:text-carbon-muted">
          No comments yet. Be the first to leave a thought.
        </p>
      )}
      <CommentForm slug={slug} />
    </section>
  );
}
