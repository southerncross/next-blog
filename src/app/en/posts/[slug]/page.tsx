import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/data';
import { AUTHOR_AVATAR, SITE_NAME } from '@/lib/constants';
import { PostView } from '@/app/_components/post-view';

type Params = {
  params: {
    slug: string;
  };
};

export default function PostEn({ params }: Params) {
  return <PostView slug={params.slug} locale="en" />;
}

export function generateMetadata({ params }: Params): Metadata {
  const post = getPostBySlug(params.slug, 'en');

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

export function generateStaticParams() {
  const posts = getAllPosts('en');

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
