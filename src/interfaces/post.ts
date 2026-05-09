import { Locale } from '@/lib/i18n';

export type Post = {
  slug: string;
  title: string;
  date: string;
  preview: boolean;
  content: string;
  locale: Locale;
  requestedLocale: Locale;
  isFallback: boolean;
  availableLocales: Locale[];
};
