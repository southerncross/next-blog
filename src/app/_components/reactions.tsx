import ReactionForm from './reaction-form';
import { getReactionsBySlug } from '@/lib/actions';
import ReactionItem from './reaction-item';
import { Locale, getMessages } from '@/lib/i18n';

type Props = {
  slug: string;
  locale: Locale;
};

export default async function Reactions({ slug, locale }: Props) {
  const reactions = await getReactionsBySlug(slug);
  const t = getMessages(locale);

  return (
    <section className="pb-12">
      <span className="label-mono">{t.reactions.label}</span>
      <ul className="mt-4 flex flex-wrap items-center gap-2">
        {reactions.map((reaction) => {
          return (
            <li key={reaction.emoji}>
              <ReactionItem reaction={reaction} />
            </li>
          );
        })}
        <li>
          <ReactionForm slug={slug} locale={locale} />
        </li>
      </ul>
    </section>
  );
}
