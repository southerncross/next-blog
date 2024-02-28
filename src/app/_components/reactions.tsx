import classNames from "classnames";

import ReactionForm from "./reaction-form";
import { getReactionsBySlug } from "@/lib/actions";
import ReactionItem from "./reaction-item";

export default async function Reactions({ slug }: { slug: string }) {
  const reactions = await getReactionsBySlug(slug);

  return (
    <section className="py-12">
      <ul className="flex flex-wrap items-center">
        {reactions.map((reaction) => {
          return (
            <li
              className="flex justify-center items-center h-10 px-2.5 mr-2 mt-2 border border-solid border-gray-200 rounded-lg"
              key={reaction.emoji}
            >
              <ReactionItem reaction={reaction} />
            </li>
          );
        })}
      </ul>
      <ReactionForm slug={slug} />
    </section>
  );
}
