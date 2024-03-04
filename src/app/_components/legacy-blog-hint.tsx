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
    <div className="mt-6 flex px-6 text-center text-xl">
      <p className="text-sm font-light">
        或许你是想访问旧的博客文章？可以看这里：
        <a className="underline" href={legacyBlogUrl} target="_blank">
          {legacyBlogUrl}
        </a>
      </p>
    </div>
  );
}
