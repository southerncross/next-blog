export const LOCALES = ['zh', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'zh';

export const HTML_LANG: Record<Locale, string> = {
  zh: 'zh-Hans',
  en: 'en',
};

export const OG_LOCALE: Record<Locale, string> = {
  zh: 'zh_CN',
  en: 'en_US',
};

export const LOCALE_COOKIE = 'NEXT_LOCALE';

export type Messages = {
  siteDescription: string;
  intro: { label: string; cliBadge: string };
  posts: {
    label: string;
    title: string;
    count: (n: number) => string;
    fallbackTag: string;
  };
  post: {
    label: string;
    cliBadge: (slug: string) => string;
    fallbackCallout: string;
    fallbackCalloutLink: string;
  };
  reactions: { label: string; add: string };
  comments: {
    label: string;
    title: string;
    count: (n: number) => string;
    empty: string;
    placeholder: string;
    submit: string;
    loginCardTitle: string;
    loginCardHint: string;
    loginButton: string;
    logout: string;
    delete: string;
  };
  toggle: { theme: string; locale: string };
  localeShort: Record<Locale, string>;
  notFound: {
    tag: string;
    title: string;
    body: string;
    cta: string;
    legacyHint: string;
  };
  footer: {
    builtWith: string;
    rss: string;
    rssCopied: string;
    rssAria: string;
  };
};

export const messages: Record<Locale, Messages> = {
  zh: {
    siteDescription: '折腾、记录、思考。',
    intro: { label: '— 个人博客', cliBadge: '~/blog $ ready' },
    posts: {
      label: '— 索引',
      title: '全部文章',
      count: (n) => `共 ${n} 篇`,
      fallbackTag: 'ZH FALLBACK',
    },
    post: {
      label: '— 文章',
      cliBadge: (slug) => `cat ./posts/${slug}.md`,
      fallbackCallout: '本文章暂无英文版本，正在显示中文原文。',
      fallbackCalloutLink: '查看中文版',
    },
    reactions: { label: '— 表情', add: '添加表情' },
    comments: {
      label: '— 评论',
      title: '讨论',
      count: (n) => `${n} 条`,
      empty: '暂无评论，欢迎留下你的想法。',
      placeholder: '写下你的评论…',
      submit: '发表',
      loginCardTitle: '加入讨论',
      loginCardHint: '登录后即可发表评论。',
      loginButton: '登录',
      logout: '登出',
      delete: '删除',
    },
    toggle: { theme: '切换主题', locale: '切换语言' },
    localeShort: { zh: '中', en: 'EN' },
    notFound: {
      tag: '错误 404',
      title: '页面未找到',
      body: '你访问的页面不存在或已被移动。',
      cta: '回到首页',
      legacyHint: '或许你是想访问旧的博客文章？可以看这里：',
    },
    footer: {
      builtWith: '使用 Next.js 构建',
      rss: 'RSS',
      rssCopied: '已复制',
      rssAria: '复制 RSS 订阅链接',
    },
  },
  en: {
    siteDescription: 'Tinkering, writing, and thinking out loud.',
    intro: { label: '— Personal Blog', cliBadge: '~/blog $ ready' },
    posts: {
      label: '— Index',
      title: 'All Posts',
      count: (n) => `${n} entries`,
      fallbackTag: 'ZH FALLBACK',
    },
    post: {
      label: '— Article',
      cliBadge: (slug) => `cat ./posts/${slug}.md`,
      fallbackCallout:
        "This article isn't available in English yet. Showing the original Chinese version.",
      fallbackCalloutLink: 'View Chinese version',
    },
    reactions: { label: '— Reactions', add: 'Add reaction' },
    comments: {
      label: '— Comments',
      title: 'Discussion',
      count: (n) => `${n} ${n === 1 ? 'reply' : 'replies'}`,
      empty: 'No comments yet. Be the first to leave a thought.',
      placeholder: 'Add your comment...',
      submit: 'Submit',
      loginCardTitle: 'Join the discussion',
      loginCardHint: 'Sign in to leave a comment.',
      loginButton: 'Log in',
      logout: 'Log out',
      delete: 'Delete',
    },
    toggle: { theme: 'Toggle theme', locale: 'Toggle language' },
    localeShort: { zh: '中', en: 'EN' },
    notFound: {
      tag: 'Error 404',
      title: 'Page not found',
      body: "The page you are looking for doesn't exist or has been moved.",
      cta: 'Go back home',
      legacyHint: 'Looking for an older post? Try the legacy site:',
    },
    footer: {
      builtWith: 'Built with Next.js',
      rss: 'RSS',
      rssCopied: 'Copied',
      rssAria: 'Copy RSS feed link',
    },
  },
};

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}

export function isLocale(value: string | undefined | null): value is Locale {
  return value === 'zh' || value === 'en';
}

export function canonicalize(pathname: string): {
  locale: Locale;
  canonical: string;
} {
  if (pathname === '/en') {
    return { locale: 'en', canonical: '/' };
  }
  if (pathname.startsWith('/en/')) {
    return { locale: 'en', canonical: pathname.slice(3) };
  }
  return { locale: 'zh', canonical: pathname };
}

export function localePath(locale: Locale, canonical: string): string {
  const path = canonical || '/';
  if (locale === 'en') {
    return path === '/' ? '/en' : `/en${path}`;
  }
  return path;
}

export function homePathFor(locale: Locale): string {
  return localePath(locale, '/');
}

export function postPathFor(locale: Locale, slug: string): string {
  return localePath(locale, `/posts/${slug}`);
}
