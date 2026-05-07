import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

export function PostTitle({ children }: Props) {
  return (
    <h1 className="mb-8 text-display-sm font-semibold leading-[1.1] tracking-tightest text-ink dark:text-carbon-text md:mb-12 md:text-display-md">
      {children}
    </h1>
  );
}
