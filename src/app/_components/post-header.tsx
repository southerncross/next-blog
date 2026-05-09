import Avatar from './avatar';
import { PostTitle } from '@/app/_components/post-title';
import { AUTHOR_NAME, AUTHOR_AVATAR } from '@/lib/constants';
import { Locale, getMessages } from '@/lib/i18n';
import DateFormatter from './date-formatter';
import { PostHeaderBackdrop } from './post-header-backdrop';
import { PostFallbackCallout } from './post-fallback-callout';

type Props = {
  title: string;
  date: string;
  slug: string;
  locale: Locale;
  requestedLocale: Locale;
  isFallback: boolean;
};

export function PostHeader({
  title,
  date,
  slug,
  locale,
  requestedLocale,
  isFallback,
}: Props) {
  const t = getMessages(locale);
  const showFallback = isFallback && requestedLocale !== 'zh';
  return (
    <header className="not-prose relative isolate mb-16 overflow-hidden border-b border-outline-subtle pb-10 pt-12 dark:border-carbon-border md:pt-16">
      <PostHeaderBackdrop />
      {showFallback && (
        <div className="anim-fade-up">
          <PostFallbackCallout slug={slug} requestedLocale={requestedLocale} />
        </div>
      )}
      <div
        className="anim-fade-up mb-8 flex items-center gap-4"
        style={{ animationDelay: showFallback ? '40ms' : undefined }}
      >
        <span className="label-mono shrink-0">{t.post.label}</span>
        <span
          className="cli-cursor inline-flex shrink-0 items-center rounded-md border border-outline-subtle bg-canvas-surface/60 px-2 py-0.5 font-mono text-[11px] text-ink-muted backdrop-blur-sm dark:border-carbon-border dark:bg-carbon-surface/60 dark:text-carbon-muted"
          aria-hidden="true"
        >
          {t.post.cliBadge(slug)}
        </span>
        <span className="h-px flex-1 bg-outline-subtle dark:bg-carbon-border" />
        <DateFormatter
          date={date}
          format="yyyy.MM.dd"
          className="shrink-0 font-mono text-xs text-ink-muted dark:text-carbon-muted"
        />
      </div>
      <div className="anim-fade-up" style={{ animationDelay: '80ms' }}>
        <PostTitle>{title}</PostTitle>
      </div>
      <div
        className="anim-fade-up flex items-center gap-3"
        style={{ animationDelay: '160ms' }}
      >
        <Avatar name={AUTHOR_NAME} picture={AUTHOR_AVATAR} />
      </div>
    </header>
  );
}
