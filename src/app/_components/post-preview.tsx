import Link from 'next/link';
import { CSSProperties } from 'react';
import DateFormatter from './date-formatter';

type Props = {
  index: number;
  title: string;
  date: string;
  slug: string;
  className?: string;
  style?: CSSProperties;
};

export function PostPreview({
  index,
  title,
  date,
  slug,
  className,
  style,
}: Props) {
  return (
    <li className={`group ${className ?? ''}`} style={style}>
      <Link
        href={`/posts/${slug}`}
        className="grid grid-cols-[auto_1fr_auto] items-baseline gap-6 py-6 transition-colors md:py-7"
      >
        <span className="font-mono text-xs tabular-nums text-ink-subtle dark:text-carbon-muted">
          {String(index).padStart(2, '0')}
        </span>
        <h3 className="text-lg font-medium leading-snug text-ink transition-colors group-hover:text-brand dark:text-carbon-text md:text-xl">
          {title}
        </h3>
        <DateFormatter
          date={date}
          format="yyyy.MM.dd"
          className="font-mono text-xs text-ink-muted dark:text-carbon-muted"
        />
      </Link>
    </li>
  );
}
