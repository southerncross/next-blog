'use client';

import { usePathname } from 'next/navigation';
import { Locale, canonicalize, getMessages } from '@/lib/i18n';

type Props = {
  locale?: Locale;
};

export default function LegacyBlogHint({ locale }: Props) {
  const pathname = usePathname();
  const { locale: detected, canonical } = canonicalize(pathname || '/');
  const effective: Locale = locale ?? detected;
  const isLegacyBlog = /\d{4}\/\d{2}\//.test(canonical);

  if (!isLegacyBlog) {
    return null;
  }

  const legacyBlogUrl = `https://southerncross.github.io/blog${canonical}`;
  const t = getMessages(effective);

  return (
    <div className="card-surface mt-6 max-w-xl px-5 py-4 text-left text-sm text-ink-muted dark:text-carbon-muted">
      <p>
        {t.notFound.legacyHint}
        <br />
        <a
          className="break-all font-mono text-xs text-brand underline-offset-4 hover:underline"
          href={legacyBlogUrl}
          target="_blank"
          rel="noreferrer"
        >
          {legacyBlogUrl}
        </a>
      </p>
    </div>
  );
}
