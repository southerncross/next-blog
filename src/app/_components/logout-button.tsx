'use client';

import { Locale, getMessages } from '@/lib/i18n';

type Props = {
  locale: Locale;
};

export default function LogoutButton({ locale }: Props) {
  return (
    <a
      className="font-mono text-xs uppercase tracking-wider text-ink-muted transition-colors hover:text-brand dark:text-carbon-muted"
      href="/api/auth/logout"
    >
      {getMessages(locale).comments.logout}
    </a>
  );
}
