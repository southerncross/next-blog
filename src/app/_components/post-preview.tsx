import Link from 'next/link';
import { CSSProperties } from 'react';
import { Locale, getMessages, postPathFor } from '@/lib/i18n';
import DateFormatter from './date-formatter';

type Props = {
  index: number;
  title: string;
  date: string;
  slug: string;
  locale: Locale;
  isFallback?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function PostPreview({
  index,
  title,
  date,
  slug,
  locale,
  isFallback = false,
  className,
  style,
}: Props) {
  const t = getMessages(locale);
  const showFallbackTag = isFallback && locale !== 'zh';
  return (
    <li className={`group ${className ?? ''}`} style={style}>
      <Link
        href={postPathFor(locale, slug)}
        className="grid grid-cols-[auto_1fr_auto] items-baseline gap-6 py-6 transition-colors md:py-7"
      >
        <span className="font-mono text-xs tabular-nums text-ink-subtle dark:text-carbon-muted">
          {String(index).padStart(2, '0')}
        </span>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-lg font-medium leading-snug text-ink transition-colors group-hover:text-brand dark:text-carbon-text md:text-xl">
            {title}
          </h3>
          {showFallbackTag && (
            <span className="rounded border border-outline-subtle px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-subtle dark:border-carbon-border dark:text-carbon-muted">
              {t.posts.fallbackTag}
            </span>
          )}
        </div>
        <DateFormatter
          date={date}
          format="yyyy.MM.dd"
          className="font-mono text-xs text-ink-muted dark:text-carbon-muted"
        />
      </Link>
    </li>
  );
}
