'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Locale, getMessages, localePath } from '@/lib/i18n';

export default function RssLink({
  locale = 'zh',
  className,
}: {
  locale?: Locale;
  className?: string;
}) {
  const t = getMessages(locale);
  const feedPath = localePath(locale, '/feed.xml');
  const [feedUrl, setFeedUrl] = useState(feedPath);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFeedUrl(`${window.location.origin}${feedPath}`);
  }, [feedPath]);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.open(feedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t.footer.rssAria}
      title={feedUrl}
      className={clsx(
        'link-quiet inline-flex items-center gap-1.5 text-sm',
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
        aria-hidden
      >
        <circle cx="6.18" cy="17.82" r="2.18" />
        <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83C19.56 11.42 12.58 4.44 4 4.44z" />
        <path d="M4 10.1v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
      </svg>
      <span>{copied ? t.footer.rssCopied : t.footer.rss}</span>
    </button>
  );
}
