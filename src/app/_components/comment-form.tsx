"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import clx from "classnames";

import { createComment } from "@/lib/actions";
import Avatar from "./avatar";
import LogoutButton from "./logout-button";
import LoginButton from "./login-button";

export default function CommentForm({ slug }: { slug: string }) {
  const { user, error, isLoading } = useUser();
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);
  const createCommentWithSlug = async () => {
    if (pending || !user) {
      return;
    }

    setPending(true);
    await createComment(slug, content);
    setContent("");
    setPending(false);
  };

  if (isLoading) {
    return <div className="flex justify-center mt-16">Loading...</div>;
  }

  if (error || !user) {
    return <LoginButton/>;
  }

  return (
    <div>
      <div>
        <Avatar name={user.name || ""} picture={user.picture || ""} />
        <textarea
          className="h-28 w-[calc(100%-64px)] px-3 py-2 ml-16 mt-2 outline outline-1 outline-slate-200 rounded-md focus:outline-none focus:ring focus:ring-gray-200"
          value={content}
          placeholder="Add your comment..."
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="flex flex-row-reverse mt-2">
        <button
          className={clx(
            "px-3 py-2 ml-2 rounded-md bg-gray-800 hover:bg-gray-700 active:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 text-white",
            { "disabled:opacity-75": pending }
          )}
          type="submit"
          onClick={createCommentWithSlug}
        >
          Submit
        </button>
        <LogoutButton />
      </div>
    </div>
  );
}