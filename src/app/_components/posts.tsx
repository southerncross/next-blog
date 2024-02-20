import { Post } from "@/interfaces/post";
import { PostPreview } from "./post-preview";

type Props = {
  posts: Post[];
};

export function Posts({ posts }: Props) {
  return (
    <section>
      <div className="grid grid-cols-1 md:gap-x-16 lg:gap-x-32 gap-y-10 md:gap-y-12 mb-32">
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            date={post.date}
            slug={post.slug}
          />
        ))}
      </div>
    </section>
  );
}
