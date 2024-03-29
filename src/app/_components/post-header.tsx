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
    <>
      <PostTitle>{title}</PostTitle>
      <div className="mb-6 flex max-w-2xl items-center md:mb-12">
        <Avatar name={AUTHOR_NAME} picture={AUTHOR_AVATAR} />
        <DateFormatter date={date} className="ml-3 text-sm text-gray-500" />
      </div>
    </>
  );
}
