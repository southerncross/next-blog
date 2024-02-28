"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { EmojiClickData } from "emoji-picker-react";
import { addReaction } from "@/lib/actions";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function ReactionForm({ slug }: { slug: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const onEmojiClick = async (reaction: EmojiClickData) => {
    await addReaction(reaction.emoji, slug);
    setIsOpen(false);
  };

  return (
    <div>
      <button
        className="w-10 h-10 mt-2 text-xl text-gray-500 border border-solid border-gray-200 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        +
      </button>
      <div className="flex justify-center">
        <EmojiPicker
          open={isOpen}
          skinTonesDisabled={true}
          onEmojiClick={onEmojiClick}
        />
      </div>
    </div>
  );
}
