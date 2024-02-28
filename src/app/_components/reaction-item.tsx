"use client";

import classNames from "classnames";

import { Reaction } from "@/interfaces/reaction";
import { addReaction } from "@/lib/actions";

export default function ReactionItem({ reaction: { emoji, count, slug } }: { reaction: Reaction }) {
  const onReactionClick = async () => {
    await addReaction(emoji, slug);
  };

  return (
    <button onClick={onReactionClick}>
      <span className="mr-1 text-2xl">{emoji}</span>
      <span className={classNames("text-xs", { hidden: count <= 0 })}>
        {count < 1000 ? count : "999+"}
      </span>
    </button>
  );
}
