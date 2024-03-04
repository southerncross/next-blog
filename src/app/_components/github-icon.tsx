'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { GITHUB_URL, THEME } from '@/lib/constants';

import githubIcon from '@public/assets/images/github.svg';
import githubIconWhite from '@public/assets/images/github-white.svg';

export default function GithubIcon({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Link className={className} href={GITHUB_URL} target="_blank">
      <Image
        src={theme === THEME.DARK ? githubIconWhite : githubIcon}
        width={24}
        height={24}
        alt="github icon"
      />
    </Link>
  );
}
