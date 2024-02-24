import Avatar from "./avatar";
import DateFormatter from "./date-formatter";
import { PostTitle } from "@/app/_components/post-title";

import { AUTHOR_NAME, AUTHOR_AVATAR } from "@/lib/constants";

type Props = {
  title: string;
  date: string;
};

export function PostHeader({ title, date }: Props) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="hidden md:block md:mb-12">
      </div>
        <Avatar name={AUTHOR_NAME} picture={AUTHOR_AVATAR} date={date}/>
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          <Avatar name={AUTHOR_NAME} picture={AUTHOR_AVATAR} date={date}/>
        </div>
      </div>
    </>
  );
}
