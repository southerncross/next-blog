import Link from 'next/link';

import { SITE_NAME } from '@/lib/constants';
import ThemeSwitcher from './theme-switcher';
import GithubIcon from './github-icon';

const Header = () => {
  return (
    <h2 className="mb-20 mt-8 flex flex-row items-center justify-between text-2xl font-bold leading-tight tracking-tight text-gray-400 md:text-3xl md:tracking-tighter">
      <Link href="/" className="hover:underline">
        {SITE_NAME}
      </Link>
      <span className="ml-2 flex flex-row items-center">
        <GithubIcon />
        <ThemeSwitcher className="ml-3" />
      </span>
    </h2>
  );
};

export default Header;
