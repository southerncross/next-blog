'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { THEME } from '@/lib/constants';
import { Locale, getMessages } from '@/lib/i18n';

type Props = {
  className?: string;
  locale?: Locale;
};

export default function ThemeSwitcher({ className, locale = 'zh' }: Props) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === THEME.DARK;

  return (
    <button
      type="button"
      aria-label={getMessages(locale).toggle.theme}
      onClick={() => setTheme(isDark ? THEME.LIGHT : THEME.DARK)}
      className={clsx(
        'inline-flex h-9 w-9 items-center justify-center rounded-button border border-transparent text-ink-muted transition-colors hover:border-outline hover:text-ink dark:text-carbon-muted dark:hover:border-carbon-border dark:hover:text-carbon-text',
        className,
      )}
    >
      {!mounted ? (
        <span className="block h-4 w-4" />
      ) : isDark ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="h-4 w-4"
        >
          <circle cx="12" cy="12" r="4" />
          <path
            strokeLinecap="round"
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          />
        </svg>
      )}
    </button>
  );
}
