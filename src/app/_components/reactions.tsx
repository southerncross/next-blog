import ReactionForm from './reaction-form';
import { getReactionsBySlug } from '@/lib/actions';
import ReactionItem from './reaction-item';

export default async function Reactions({ slug }: { slug: string }) {
  const reactions = await getReactionsBySlug(slug);

  return (
    <section className="pb-12">
      <span className="label-mono">— Reactions</span>
      <ul className="mt-4 flex flex-wrap items-center gap-2">
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
