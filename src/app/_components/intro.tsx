'use client';

import { SITE_NAME } from '@/lib/constants';
import ThemeSwitcher from './theme-switcher';
import GithubIcon from './github-icon';

export function Intro() {
  return (
    <section className="mb-20 mt-16 flex flex-row items-center justify-between md:mb-24">
      <h1 className="text-4xl font-bold leading-tight tracking-tighter md:pr-8 md:text-6xl">
        {SITE_NAME}
      </h1>
      <h4 className="ml-2 flex flex-row items-center text-center text-lg md:pl-8 md:text-left">
        <GithubIcon />
        <ThemeSwitcher className="ml-3" />
      </h4>
    </section>
  );
}
