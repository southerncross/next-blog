import Avatar from './avatar';
import { PostTitle } from '@/app/_components/post-title';
import { AUTHOR_NAME, AUTHOR_AVATAR } from '@/lib/constants';
import DateFormatter from './date-formatter';

type Props = {
  title: string;
  date: string;
};

export function PostHeader({ title, date }: Props) {
  return (
    <header className="not-prose mb-16 border-b border-outline-subtle pb-10 pt-12 dark:border-carbon-border md:pt-16">
      <div className="mb-8 flex items-center gap-4">
        <span className="label-mono">— Article</span>
        <span className="h-px flex-1 bg-outline-subtle dark:bg-carbon-border" />
        <DateFormatter
          date={date}
          format="yyyy.MM.dd"
          className="font-mono text-xs text-ink-muted dark:text-carbon-muted"
        />
      </div>
      <PostTitle>{title}</PostTitle>
      <div className="flex items-center gap-3">
        <Avatar name={AUTHOR_NAME} picture={AUTHOR_AVATAR} />
      </div>
    </header>
  );
}
