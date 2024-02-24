import { Comment } from "@/interfaces/comment";
import CommentForm from "./comment-form";
import CommentItem from "./comment-item";

const Comments = ({
  slug,
  comments,
}: {
  slug: string;
  comments: Comment[];
}) => {
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
        <p className="ml-6 mb-12">No comments yet.</p>
      )}
      <CommentForm slug={slug} />
    </section>
  );
};

export default Comments;
