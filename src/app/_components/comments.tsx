import CommentForm from './comment-form';
import CommentItem from './comment-item';
import { getCommentsBySlug } from '@/lib/data';
import { Locale, getMessages } from '@/lib/i18n';

type Props = {
  slug: string;
  locale: Locale;
};

export default async function Comments({ slug, locale }: Props) {
  const comments = await getCommentsBySlug(slug);
  const t = getMessages(locale);

  return (
    <section className="mt-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="label-mono">{t.comments.label}</span>
          <h2 className="mt-3 text-h2 font-semibold tracking-tighter text-ink dark:text-carbon-text">
            {t.comments.title}
          </h2>
        </div>
        <span className="label-mono">{t.comments.count(comments.length)}</span>
      </div>
      {comments.length > 0 ? (
        <ul className="mb-10 divide-y divide-outline-subtle border-y border-outline-subtle dark:divide-carbon-border dark:border-carbon-border">
          {comments.map((comment) => (
            <li key={comment.id}>
              <CommentItem comment={comment} locale={locale} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-10 border-y border-outline-subtle py-8 text-sm text-ink-muted dark:border-carbon-border dark:text-carbon-muted">
          {t.comments.empty}
        </p>
      )}
      <CommentForm slug={slug} locale={locale} />
    </section>
  );
}
