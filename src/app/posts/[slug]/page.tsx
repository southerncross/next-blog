import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getAllPosts, getPostBySlug } from '../../../lib/data';
import { AUTHOR_AVATAR, SITE_NAME } from '../../../lib/constants';
import markdownToHtml from '../../../lib/markdownToHtml';
import Container from '../../_components/container';
import Header from '../../_components/header';
import { PostBody } from '../../_components/post-body';
import { PostHeader } from '../../_components/post-header';
import Comments from '@/app/_components/comments';
import Reactions from '@/app/_components/reactions';

export default async function Post({ params }: Params) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || '');

  return (
    <main>
      <Container>
        <Header />
        <article className="prose dark:prose-invert md:prose-lg lg:prose-xl">
          <PostHeader title={post.title} date={post.date} />
          <PostBody content={content} />
        </article>
        <Suspense>
          <Reactions slug={post.slug} />
        </Suspense>
        <Suspense>
          <Comments slug={post.slug} />
        </Suspense>
      </Container>
    </main>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: Params): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | ${SITE_NAME}`;

  return {
    openGraph: {
      title,
      images: [AUTHOR_AVATAR],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
