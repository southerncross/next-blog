import { Post } from '@/interfaces/post';
import { PostPreview } from './post-preview';

type Props = {
  posts: Post[];
};

export function Posts({ posts }: Props) {
  return (
    <section className="py-16 md:py-24">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <span className="label-mono">— Index</span>
          <h2 className="mt-4 text-h2 font-semibold tracking-tighter text-ink dark:text-carbon-text">
            All Posts
          </h2>
        </div>
        <span className="label-mono">{posts.length} entries</span>
      </div>
      <ol className="divide-y divide-outline-subtle border-y border-outline-subtle dark:divide-carbon-border dark:border-carbon-border">
        {posts.map((post, idx) => (
          <PostPreview
            key={post.slug}
            index={idx + 1}
            title={post.title}
            date={post.date}
            slug={post.slug}
            className="anim-fade-up"
            style={{ animationDelay: `${Math.min(idx, 8) * 60}ms` }}
          />
        ))}
      </ol>
    </section>
  );
}
