'use client';

import { usePathname } from 'next/navigation';

export default function LoginButton() {
  const pathname = usePathname();

  return (
    <div className="card-surface flex flex-col items-center gap-3 px-6 py-8 text-center md:flex-row md:justify-between md:text-left">
      <div>
        <p className="text-sm font-medium text-ink dark:text-carbon-text">
          Join the discussion
        </p>
        <p className="mt-1 text-sm text-ink-muted dark:text-carbon-muted">
          Sign in to leave a comment.
        </p>
      </div>
      <a
        className="btn-primary"
        href={`/api/auth/login?returnTo=${encodeURIComponent(pathname)}`}
      >
        Log in
      </a>
    </div>
  );
}
