"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { EmojiClickData } from "emoji-picker-react";
import { Button } from "@nextui-org/button";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";

import { addReaction } from "@/lib/actions";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function ReactionForm({ slug }: { slug: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const onEmojiClick = async (reaction: EmojiClickData) => {
    await addReaction(reaction.emoji, slug);
    setIsOpen(false);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button>+</Button>
      </PopoverTrigger>
      <PopoverContent>
        <EmojiPicker
          open={true}
          skinTonesDisabled={true}
          onEmojiClick={onEmojiClick}
        />
      </PopoverContent>
    </Popover>
  );
}