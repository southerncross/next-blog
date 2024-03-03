"use client";

import dynamic from "next/dynamic";
import { EmojiClickData, Theme } from "emoji-picker-react";
import { Button } from "@nextui-org/button";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { useTheme } from "next-themes";

import { addReaction } from "@/lib/actions";
import { THEME } from "@/lib/constants";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function ReactionForm({ slug }: { slug: string }) {
  const { theme } = useTheme();
  const onEmojiClick = async (reaction: EmojiClickData) => {
    await addReaction(reaction.emoji, slug);
  };

  return (
    <Popover classNames={{ content: "px-0 py-0" }}>
      <PopoverTrigger>
        <Button
          isIconOnly
          variant="light"
          radius="md"
          aria-label="Add reaction"
        >
          +
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <EmojiPicker
          open={true}
          skinTonesDisabled={true}
          autoFocusSearch={false}
          theme={theme === THEME.DARK ? Theme.DARK : Theme.LIGHT}
          onEmojiClick={onEmojiClick}
        />
      </PopoverContent>
    </Popover>
  );
}
