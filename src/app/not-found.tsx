import Link from 'next/link';
import LegacyBlogHint from './_components/legacy-blog-hint';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-brand">
        Error 404
      </span>
      <h1 className="text-display-sm font-semibold tracking-tightest text-ink dark:text-carbon-text">
        Page not found
      </h1>
      <p className="max-w-md text-base text-ink-muted dark:text-carbon-muted">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary">
        Go back home
      </Link>
      <LegacyBlogHint />
    </main>
  );
}
