import Link from 'next/link';
import { headers } from 'next/headers';
import { canonicalize, getMessages, homePathFor } from '@/lib/i18n';
import LegacyBlogHint from './_components/legacy-blog-hint';

export default function NotFound() {
  const path = headers().get('x-pathname') || '/';
  const { locale } = canonicalize(path);
  const t = getMessages(locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-brand">
        {t.notFound.tag}
      </span>
      <h1 className="text-display-sm font-semibold tracking-tightest text-ink dark:text-carbon-text">
        {t.notFound.title}
      </h1>
      <p className="max-w-md text-base text-ink-muted dark:text-carbon-muted">
        {t.notFound.body}
      </p>
      <Link href={homePathFor(locale)} className="btn-primary">
        {t.notFound.cta}
      </Link>
      <LegacyBlogHint locale={locale} />
    </main>
  );
}
