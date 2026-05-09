import Link from 'next/link';

import { SITE_NAME } from '@/lib/constants';
import { Locale, homePathFor } from '@/lib/i18n';
import ThemeSwitcher from './theme-switcher';
import GithubIcon from './github-icon';
import LocaleSwitcher from './locale-switcher';

type Props = {
  locale?: Locale;
};

const Header = ({ locale = 'zh' }: Props) => {
  return (
    <header className="flex items-center justify-between border-b border-outline-subtle py-6 dark:border-carbon-border">
      <Link
        href={homePathFor(locale)}
        className="group flex items-center gap-3 text-sm font-medium tracking-tight text-ink transition-colors hover:text-brand dark:text-carbon-text"
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
        <span>{SITE_NAME}</span>
      </Link>
      <div className="flex items-center gap-1">
        <GithubIcon />
        <LocaleSwitcher />
        <ThemeSwitcher locale={locale} />
      </div>
    </header>
  );
};

export default Header;
