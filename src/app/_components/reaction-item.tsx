"use client";

import { useState } from "react";
import classNames from "classnames";
import { Button } from "@nextui-org/button";

import { Reaction } from "@/interfaces/reaction";
import { addReaction } from "@/lib/actions";
import Spinner from "./spinner";

export default function ReactionItem({
  reaction: { emoji, count, slug },
}: {
  reaction: Reaction;
}) {
  const [isPending, setIsPending] = useState(false);
  const onReactionClick = async () => {
    if (isPending) {
      return;
    }

    setIsPending(true);
    await addReaction(emoji, slug);
    setIsPending(false);
  };

  return (
    <Button variant="light" radius="md" onClick={onReactionClick}>
      <span className="text-2xl">{emoji}</span>
      {isPending ? (
        <Spinner />
      ) : (
        <span className={classNames("text-xs", { hidden: count <= 0 })}>
          {count < 1000 ? count : "999+"}
        </span>
      )}
    </Button>
  );
}
