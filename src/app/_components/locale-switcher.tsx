'use client';

import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import {
  Locale,
  LOCALE_COOKIE,
  canonicalize,
  getMessages,
  localePath,
} from '@/lib/i18n';

export default function LocaleSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale: current, canonical } = canonicalize(pathname || '/');

  const target: Locale = current === 'zh' ? 'en' : 'zh';
  const targetPath = localePath(target, canonical);
  const ariaLabel = getMessages(current).toggle.locale;

  const onClick = () => {
    document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    router.push(targetPath);
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={clsx(
        'inline-flex h-9 items-center justify-center gap-1 rounded-button border border-transparent px-2 font-mono text-xs uppercase tracking-wider text-ink-muted transition-colors hover:border-outline hover:text-ink dark:text-carbon-muted dark:hover:border-carbon-border dark:hover:text-carbon-text',
        className,
      )}
    >
      <span className={clsx(current === 'zh' && 'text-brand')}>中</span>
      <span aria-hidden="true" className="text-ink-subtle">
        /
      </span>
      <span className={clsx(current === 'en' && 'text-brand')}>EN</span>
    </button>
  );
}
