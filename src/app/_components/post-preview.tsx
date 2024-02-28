import Link from "next/link";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  date: string;
  slug: string;
};

export function PostPreview({
  title,
  date,
  slug,
}: Props) {
  return (
    <div>
      <h3 className="text-3xl mb-2 leading-snug">
        <Link
          as={`/posts/${slug}`}
          href="/posts/[slug]"
          className="hover:underline"
        >
          {title}
        </Link>
      </h3>
      <div className="text-lg mb-2 text-gray-500">
        <DateFormatter date={date} />
      </div>
    </div>
  );
}
