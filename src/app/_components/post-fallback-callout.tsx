import Link from 'next/link';
import { Locale, getMessages, postPathFor } from '@/lib/i18n';

type Props = {
  slug: string;
  requestedLocale: Locale;
};

export function PostFallbackCallout({ slug, requestedLocale }: Props) {
  const t = getMessages(requestedLocale);
  return (
    <div
      role="note"
      className="mb-8 flex flex-col gap-2 rounded-card border border-outline-subtle bg-canvas-surface/60 px-4 py-3 text-sm text-ink-muted backdrop-blur-sm dark:border-carbon-border dark:bg-carbon-surface/60 dark:text-carbon-muted md:flex-row md:items-center md:justify-between"
    >
      <span>{t.post.fallbackCallout}</span>
      <Link
        href={postPathFor('zh', slug)}
        className="font-mono text-xs uppercase tracking-wider text-brand underline-offset-4 hover:underline"
      >
        {t.post.fallbackCalloutLink}
      </Link>
    </div>
  );
}
