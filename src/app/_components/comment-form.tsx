"use client";

import { useState } from "react";
import clx from "classnames";

import { createComment } from "@/lib/actions";

export default function CommentForm({ slug }: { slug: string }) {
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);
  const createCommentWithSlug = async () => {
    if (pending) {
      return;
    }

    setPending(true);
    await createComment(slug, content);
    setContent("");
    setPending(false);
  };

  return (
    <div>
      <div>
        <textarea
          className="w-full h-28 px-3 py-2 outline outline-2 outline-slate-300 rounded-md focus:outline-none focus:ring focus:ring-gray-300"
          value={content}
          placeholder="Add your comment..."
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="flex flex-row-reverse mt-2">
        <button
          className={clx(
            "px-3 py-2 rounded-md bg-gray-500 hover:bg-gray-600 active:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 text-white",
            { "disabled:opacity-75": pending }
          )}
          type="submit"
          onClick={createCommentWithSlug}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
