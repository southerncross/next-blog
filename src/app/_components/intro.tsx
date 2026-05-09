import { SITE_NAME } from '@/lib/constants';
import { Locale, getMessages } from '@/lib/i18n';
import ThemeSwitcher from './theme-switcher';
import GithubIcon from './github-icon';
import LocaleSwitcher from './locale-switcher';
import { HeroBackdrop } from './hero-backdrop';

type Props = {
  locale: Locale;
};

export function Intro({ locale }: Props) {
  const t = getMessages(locale);
  return (
    <section className="relative isolate overflow-hidden border-b border-outline-subtle pb-16 pt-24 dark:border-carbon-border md:pb-24 md:pt-32">
      <HeroBackdrop />
      <div className="flex items-start justify-between">
        <div className="max-w-2xl">
          <div className="anim-fade-up flex items-center gap-3">
            <span className="label-mono">{t.intro.label}</span>
            <span
              className="cli-cursor inline-flex items-center rounded-md border border-outline-subtle bg-canvas-surface/60 px-2 py-0.5 font-mono text-[11px] text-ink-muted backdrop-blur-sm dark:border-carbon-border dark:bg-carbon-surface/60 dark:text-carbon-muted"
              aria-hidden="true"
            >
              {t.intro.cliBadge}
            </span>
          </div>
          <h1
            className="anim-fade-up mt-6 text-display-sm font-semibold text-ink dark:text-carbon-text md:text-display-md"
            style={{ animationDelay: '80ms' }}
          >
            {SITE_NAME}
          </h1>
          <p
            className="anim-fade-up mt-6 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg"
            style={{ animationDelay: '160ms' }}
          >
            {t.siteDescription}
          </p>
        </div>
        <div
          className="anim-fade-up hidden items-center gap-2 md:flex"
          style={{ animationDelay: '200ms' }}
        >
          <GithubIcon />
          <LocaleSwitcher />
          <ThemeSwitcher locale={locale} />
        </div>
      </div>
      <div
        className="anim-fade-up mt-10 flex items-center gap-2 md:hidden"
        style={{ animationDelay: '200ms' }}
      >
        <GithubIcon />
        <LocaleSwitcher />
        <ThemeSwitcher locale={locale} />
      </div>
    </section>
  );
}
