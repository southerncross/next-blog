'use client';

import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import { Comment } from '@/interfaces/comment';
import { deleteComment } from '@/lib/actions';
import { Locale, getMessages } from '@/lib/i18n';
import Avatar from './avatar';
import Spinner from './spinner';
import DateFormatter from './date-formatter';

type Props = {
  comment: Comment;
  locale: Locale;
};

export default function CommentItem({ comment, locale }: Props) {
  const { id, slug, content, author, createdAt } = comment;
  const t = getMessages(locale);
  const { user } = useUser();
  const deletable = user?.sub === author.sub;
  const [pending, setPending] = useState(false);
  const deleteCommentById = async () => {
    if (pending) {
      return;
    }

    setPending(true);
    await deleteComment(id, slug);
  };

  return (
    <article className="relative py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={author.name} picture={author.picture} />
          <span className="text-ink-subtle dark:text-carbon-muted">·</span>
          <DateFormatter
            date={createdAt}
            className="font-mono text-xs text-ink-muted dark:text-carbon-muted"
          />
        </div>
        {deletable && (
          <div className="text-right">
            {pending ? (
              <Spinner />
            ) : (
              <button
                className="font-mono text-xs uppercase tracking-wider text-ink-muted transition-colors hover:text-brand"
                onClick={deleteCommentById}
              >
                {t.comments.delete}
              </button>
            )}
          </div>
        )}
      </div>
      <p className="mt-3 whitespace-pre-wrap pl-12 text-[15px] leading-relaxed text-ink dark:text-carbon-text">
        {content}
      </p>
    </article>
  );
}
