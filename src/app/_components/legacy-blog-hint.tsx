'use client';

import { usePathname } from 'next/navigation';

export default function LegacyBlogHint() {
  const pathname = usePathname();
  const isLegacyBlog = /\d{4}\/\d{2}\//.test(pathname);

  if (!isLegacyBlog) {
    return null;
  }

  const legacyBlogUrl = `https://southerncross.github.io/blog${pathname}`;

  return (
    <div className="card-surface mt-6 max-w-xl px-5 py-4 text-left text-sm text-ink-muted dark:text-carbon-muted">
      <p>
        或许你是想访问旧的博客文章？可以看这里：
        <br />
        <a
          className="break-all font-mono text-xs text-brand underline-offset-4 hover:underline"
          href={legacyBlogUrl}
          target="_blank"
          rel="noreferrer"
        >
          {legacyBlogUrl}
        </a>
      </p>
    </div>
  );
}
