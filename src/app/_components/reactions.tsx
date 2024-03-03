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
            <li key={reaction.emoji}>
              <ReactionItem reaction={reaction} />
            </li>
          );
        })}
        <li>
          <ReactionForm slug={slug} />
        </li>
      </ul>
    </section>
  );
}
