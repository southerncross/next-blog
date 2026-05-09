'use client';

import { usePathname } from 'next/navigation';
import { Locale, getMessages } from '@/lib/i18n';

type Props = {
  locale: Locale;
};

export default function LoginButton({ locale }: Props) {
  const pathname = usePathname();
  const t = getMessages(locale);

  return (
    <div className="card-surface flex flex-col items-center gap-3 px-6 py-8 text-center md:flex-row md:justify-between md:text-left">
      <div>
        <p className="text-sm font-medium text-ink dark:text-carbon-text">
          {t.comments.loginCardTitle}
        </p>
        <p className="mt-1 text-sm text-ink-muted dark:text-carbon-muted">
          {t.comments.loginCardHint}
        </p>
      </div>
      <a
        className="btn-primary"
        href={`/api/auth/login?returnTo=${encodeURIComponent(pathname)}`}
      >
        {t.comments.loginButton}
      </a>
    </div>
  );
}
