'use client';

import { useEffect, useState } from 'react';
import { Locale, getMessages, postPathFor } from '@/lib/i18n';
import { SITE_HOST } from '@/lib/constants';

type Props = {
  slug: string;
  locale: Locale;
  title: string;
};

const buttonClass =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-button border border-outline-subtle px-3 text-sm text-ink-muted transition-colors hover:border-brand hover:text-brand dark:border-carbon-border dark:text-carbon-muted';

export default function PostShare({ slug, locale, title }: Props) {
  const t = getMessages(locale);
  const [url, setUrl] = useState(`${SITE_HOST}${postPathFor(locale, slug)}`);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
    setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt(t.share.copy, url);
    }
  };

  const onNativeShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // user cancelled or sharing is unavailable
    }
  };

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title,
  )}&url=${encodeURIComponent(url)}`;
  const weiboUrl = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(
    title,
  )}&url=${encodeURIComponent(url)}`;

  return (
    <section className="pb-12">
      <span className="label-mono">{t.share.label}</span>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onCopy}
          aria-label={t.share.ariaCopy}
          title={url}
          className={buttonClass}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-4 w-4"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 13.5a3 3 0 004.24 0l2.76-2.76a3 3 0 00-4.24-4.24l-1 1"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 10.5a3 3 0 00-4.24 0L7 13.26a3 3 0 004.24 4.24l1-1"
            />
          </svg>
          <span>{copied ? t.share.copied : t.share.copy}</span>
        </button>
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.share.x}
          title={t.share.x}
          className={buttonClass}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>{t.share.x}</span>
        </a>
        <a
          href={weiboUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.share.weibo}
          title={t.share.weibo}
          className={buttonClass}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M10.1 20.2c-3.9.4-7.3-1.3-7.6-3.8-.3-2.5 2.7-4.9 6.6-5.3 3.9-.4 7.3 1.3 7.6 3.8.3 2.5-2.7 4.9-6.6 5.3zm.7-3.1c-.4.6-1.2.9-1.8.6-.6-.3-.7-1-.3-1.6.4-.6 1.1-.9 1.7-.6.6.2.8.9.4 1.6zm1.2-1.5c-.1.2-.4.3-.6.2-.2-.1-.3-.4-.1-.6.1-.2.4-.3.6-.2.2.1.2.4.1.6zm6-5.2c-.3-.1-.5-.2-.4-.5.3-.9.3-1.7-.1-2.2-.7-1-2.6-.9-4.8 0 0 0-.7.3-.5-.3.3-.9.3-1.7-.1-2.1-1-1-3.6.1-5.9 2.3C4.5 8.9 3.5 10.6 3.5 12c0 2.8 3.6 4.5 7.1 4.5 4.6 0 7.7-2.7 7.7-4.8 0-1.3-1.1-2-2-2.3zm1.8-3.7c-.4-.4-.9-.6-1.5-.5-.3.1-.5.4-.4.7.1.3.4.5.7.4.2-.1.4 0 .6.1.2.2.2.4.1.6-.1.3 0 .6.3.7.3.1.6 0 .7-.3.2-.7.1-1.4-.3-2-.1-.1-.1-.1-.2-.2zm1.9-1.7C22.6 3.9 21.4 3.4 20.2 3.6c-.4.1-.6.5-.5.8.1.4.5.6.8.5.6-.1 1.2.1 1.7.5.4.4.6 1 .6 1.6 0 .4.3.7.7.7s.7-.3.7-.7c0-1-.4-1.9-1.1-2.7-.1 0-.1-.1-.1-.1z" />
          </svg>
          <span>{t.share.weibo}</span>
        </a>
        {canNativeShare && (
          <button
            type="button"
            onClick={onNativeShare}
            aria-label={t.share.native}
            className={buttonClass}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-4 w-4"
              aria-hidden
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path
                strokeLinecap="round"
                d="M8.6 10.6l6.8-3.9M8.6 13.4l6.8 3.9"
              />
            </svg>
            <span>{t.share.native}</span>
          </button>
        )}
      </div>
    </section>
  );
}
