import Link from 'next/link';
import DateFormatter from './date-formatter';

type Props = {
  title: string;
  date: string;
  slug: string;
};

export function PostPreview({ title, date, slug }: Props) {
  return (
    <div>
      <h3 className="mb-2 text-3xl leading-snug">
        <Link
          href={`/posts/${slug}`}
          className="hover:underline"
        >
          {title}
        </Link>
      </h3>
      <div className="mb-2 text-lg text-gray-500">
        <DateFormatter date={date} />
      </div>
    </div>
  );
}
