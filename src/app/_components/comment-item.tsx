"use client";

import { useState } from "react";

import { Comment } from "@/interfaces/comment";
import { deleteComment } from "@/lib/actions";
import { formatDateToLocal } from "@/lib/utils";
import Avatar from "./avatar";
import Spinner from "./spinner";
import DateFormatter from "./date-formatter";

export default function CommentItem({ comment }: { comment: Comment }) {
  const { id, slug, content, author, deletable, createdAt } = comment;
  const [pending, setPending] = useState(false);
  const deleteCommentById = async () => {
    if (pending) {
      return;
    }

    setPending(true);
    await deleteComment(id, slug);
  };

  return (
    <div className="relative my-6">
      <div className="flex items-center">
        <Avatar name={author.name} picture={author.picture} />
        <DateFormatter date={createdAt} className="ml-3 text-sm text-gray-500"/>
        {/* <p className="ml-3 text-sm text-gray-500">
          {formatDateToLocal(createdAt)}
        </p> */}
      </div>
      <p className="pl-16 mt-2 text-base whitespace-pre">{content}</p>
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
    </div>
  );
}
