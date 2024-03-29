'use client';

import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import { Comment } from '@/interfaces/comment';
import { deleteComment } from '@/lib/actions';
import Avatar from './avatar';
import Spinner from './spinner';
import DateFormatter from './date-formatter';

export default function CommentItem({ comment }: { comment: Comment }) {
  const { id, slug, content, author, createdAt } = comment;
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
    <article className="relative my-6">
      <div className="flex items-center">
        <Avatar name={author.name} picture={author.picture} />
        <DateFormatter
          date={createdAt}
          className="ml-3 text-sm text-gray-500"
        />
      </div>
      <p className="mt-2 whitespace-pre pl-16 text-base">{content}</p>
      {deletable && (
        <div className="absolute right-0 top-3 w-20 text-center">
          {pending ? (
            <Spinner />
          ) : (
            <button
              className="text-rose-600 hover:text-rose-500"
              onClick={deleteCommentById}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
}
