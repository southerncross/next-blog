'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import darkModeIcon from '@public/assets/images/dark-mode.svg';
import lightModeIcon from '@public/assets/images/light-mode.svg';
import { THEME } from '@/lib/constants';

export default function ThemeSwitcher({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={clsx('cursor-pointer p-2', className)}>
      <Image
        src={theme === THEME.DARK ? darkModeIcon : lightModeIcon}
        width={30}
        height={30}
        alt={theme === THEME.DARK ? 'dark mode' : 'light mode'}
        onClick={() =>
          setTheme(theme === THEME.DARK ? THEME.LIGHT : THEME.DARK)
        }
      />
    </div>
  );
}
