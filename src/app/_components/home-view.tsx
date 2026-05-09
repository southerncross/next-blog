import Container from '@/app/_components/container';
import { Intro } from '@/app/_components/intro';
import { Posts } from '@/app/_components/posts';
import { getAllPosts } from '@/lib/data';
import { Locale } from '@/lib/i18n';

type Props = {
  locale: Locale;
};

export function HomeView({ locale }: Props) {
  const allPosts = getAllPosts(locale);

  return (
    <main>
      <Container size="wide">
        <Intro locale={locale} />
        <Posts posts={allPosts} locale={locale} />
      </Container>
    </main>
  );
}
