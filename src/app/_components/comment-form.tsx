"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import classNames from "classnames";

import { createComment } from "@/lib/actions";
import Avatar from "./avatar";
import LogoutButton from "./logout-button";
import LoginButton from "./login-button";
import Spinner from "./spinner";

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
    return (
      <div className="flex justify-center mt-16">
        <Spinner color="gray" />
      </div>
    );
  }

  if (error || !user) {
    return <LoginButton />;
  }

  return (
    <div>
      <div>
        <Avatar name={user.name || ""} picture={user.picture || ""} />
        <textarea
          className="h-28 w-full md:w-[calc(100%-64px)] px-3 py-2 md:ml-16 mt-4 md:mt-2 outline outline-1 outline-slate-200 rounded-md focus:outline-none focus:ring focus:ring-gray-200"
          value={content}
          placeholder="Add your comment..."
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="flex flex-row-reverse mt-2">
        <button
          className="flex items-center px-3 py-2 ml-2 rounded-md bg-gray-800 hover:bg-gray-700 active:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 text-white"
          type="submit"
          onClick={createCommentWithSlug}
        >
          {pending && <Spinner color="white" />}
          <span className={classNames({ "ml-2": pending })}>Submit</span>
        </button>
        <LogoutButton />
      </div>
    </div>
  );
}
