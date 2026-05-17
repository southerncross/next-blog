import { Suspense } from 'react';
import { getPostBySlug } from '@/lib/data';
import markdownToHtml from '@/lib/markdownToHtml';
import { Locale } from '@/lib/i18n';
import Container from '@/app/_components/container';
import Header from '@/app/_components/header';
import { PostBody } from '@/app/_components/post-body';
import { PostHeader } from '@/app/_components/post-header';
import Comments from '@/app/_components/comments';
import Reactions from '@/app/_components/reactions';
import ReadingProgress from '@/app/_components/reading-progress';

type Props = {
  slug: string;
  locale: Locale;
};

export async function PostView({ slug, locale }: Props) {
  const post = getPostBySlug(slug, locale);
  const content = await markdownToHtml(post.content || '');

  return (
    <main>
      <div className="sticky top-0 z-40 bg-canvas dark:bg-carbon">
        <Container size="wide">
          <Header locale={locale} />
        </Container>
        <ReadingProgress />
      </div>
      <Container size="narrow" className="pb-24">
        <article className="prose prose-neutral max-w-none dark:prose-invert md:prose-lg">
          <PostHeader
            title={post.title}
            date={post.date}
            slug={post.slug}
            locale={post.locale}
            requestedLocale={post.requestedLocale}
            isFallback={post.isFallback}
            description={post.description}
            topics={post.topics}
          />
          <div className="anim-fade-up" style={{ animationDelay: '240ms' }}>
            <PostBody content={content} />
          </div>
        </article>
        <div
          className="anim-fade-up mt-16 border-t border-outline-subtle pt-10 dark:border-carbon-border"
          style={{ animationDelay: '320ms' }}
        >
          <Suspense>
            <Reactions slug={post.slug} locale={locale} />
          </Suspense>
          <Suspense>
            <Comments slug={post.slug} locale={locale} />
          </Suspense>
        </div>
      </Container>
    </main>
  );
}
