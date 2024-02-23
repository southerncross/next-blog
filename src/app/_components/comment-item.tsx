'use client';

import { useState } from 'react';

import { Comment } from "@/interfaces/comment";
import { deleteComment } from "@/lib/actions";
import { formatDateToLocal } from '@/lib/utils';

export default function CommentItem({ comment }: { comment: Comment }) {
  const [pending, setPending] = useState(false);
  const deleteCommentById = async () => {
    if (pending) {
      return;
    }

    setPending(true);
    await deleteComment(comment.id, comment.slug);
    setPending(false);
  }

  return (
    <div className="relative my-6">
      <button className="absolute top-0 right-0 text-rose-600 hover:text-rose-500" onClick={deleteCommentById}>Delete</button>
      <p>{formatDateToLocal(comment.createdAt)}</p>
      <p>{comment.content}</p>
    </div>
  );
};
