"use client";

import { useState } from "react";

import { Comment } from "@/interfaces/comment";
import { deleteComment } from "@/lib/actions";
import { formatDateToLocal } from "@/lib/utils";
import Avatar from "./avatar";

export default function CommentItem({ comment }: { comment: Comment }) {
  const { id, slug, content, author, deletable, createdAt } = comment;
  const [pending, setPending] = useState(false);
  const deleteCommentById = async () => {
    if (pending) {
      return;
    }

    setPending(true);
    await deleteComment(id, slug);
    setPending(false);
  };

  return (
    <div className="relative my-6">
      <Avatar name={author.name} picture={author.picture} date={createdAt} />
      <p className="pl-16 mt-2 text-base">{content}</p>
      {deletable && (
        <button
          className="absolute right-0 top-3 text-rose-600 hover:text-rose-500"
          onClick={deleteCommentById}
        >
          Delete
        </button>
      )}
    </div>
  );
}
