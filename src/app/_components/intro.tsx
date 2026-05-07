import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';
import ThemeSwitcher from './theme-switcher';
import GithubIcon from './github-icon';

export function Intro() {
  return (
    <section className="border-b border-outline-subtle pb-16 pt-24 dark:border-carbon-border md:pb-24 md:pt-32">
      <div className="flex items-start justify-between">
        <div className="max-w-2xl">
          <span className="label-mono">— Personal Blog</span>
          <h1 className="mt-6 text-display-sm font-semibold text-ink dark:text-carbon-text md:text-display-md">
            {SITE_NAME}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
            {SITE_DESCRIPTION}
          </p>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <GithubIcon />
          <ThemeSwitcher />
        </div>
      </div>
      <div className="mt-10 flex items-center gap-2 md:hidden">
        <GithubIcon />
        <ThemeSwitcher />
      </div>
    </section>
  );
}
