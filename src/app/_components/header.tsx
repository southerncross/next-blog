import Link from 'next/link';

import { SITE_NAME } from '@/lib/constants';
import ThemeSwitcher from './theme-switcher';
import GithubIcon from './github-icon';

const Header = () => {
  return (
    <header className="flex items-center justify-between border-b border-outline-subtle py-6 dark:border-carbon-border">
      <Link
        href="/"
        className="group flex items-center gap-3 text-sm font-medium tracking-tight text-ink transition-colors hover:text-brand dark:text-carbon-text"
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
        <span>{SITE_NAME}</span>
      </Link>
      <div className="flex items-center gap-1">
        <GithubIcon />
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
