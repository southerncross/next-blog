import Avatar from "./avatar";
import { PostTitle } from "@/app/_components/post-title";
import { AUTHOR_NAME, AUTHOR_AVATAR } from "@/lib/constants";
import { formatDateToLocal } from "@/lib/utils";

type Props = {
  title: string;
  date: string;
};

export function PostHeader({ title, date }: Props) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="flex items-center max-w-2xl mb-6 md:mb-12">
        <Avatar name={AUTHOR_NAME} picture={AUTHOR_AVATAR} />
        <p className="ml-3 text-sm text-gray-500">{formatDateToLocal(date)}</p>
      </div>
    </>
  );
}
