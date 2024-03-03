"use client";

import { SITE_NAME } from "@/lib/constants";
import ThemeSwitcher from "./theme-switcher";
import GithubIcon from "./github-icon";

export function Intro() {
  return (
    <section className="flex-row flex items-center justify-between mt-16 mb-20 md:mb-24">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight md:pr-8">
        {SITE_NAME}
      </h1>
      <h4 className="flex flex-row items-center ml-2 text-center md:text-left text-lg md:pl-8">
        <GithubIcon />
        <ThemeSwitcher className="ml-3" />
      </h4>
    </section>
  );
}
