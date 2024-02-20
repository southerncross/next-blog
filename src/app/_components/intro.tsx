import Image from "next/image";

import githubIcon from '@/public/assets/images/github-mark.svg';
import { SITE_NAME } from "@/lib/constants";

export function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight md:pr-8">
        {SITE_NAME}
      </h1>
      <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        <Image src={githubIcon} width={24} height={24} alt="github icon" />
      </h4>
    </section>
  );
}
