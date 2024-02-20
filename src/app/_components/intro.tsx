import Image from "next/image";
import Link from 'next/link';

import githubIcon from '@public/assets/images/github.svg';
import { SITE_NAME, GITHUB_URL } from "@/lib/constants";

export function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-20 md:mb-24">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight md:pr-8">
        {SITE_NAME}
      </h1>
      <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        <Link href={GITHUB_URL} target="_blank">
          <Image src={githubIcon} width={24} height={24} alt="github icon" />
        </Link>
      </h4>
    </section>
  );
}
