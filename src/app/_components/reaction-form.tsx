'use client';

import dynamic from 'next/dynamic';
import { EmojiClickData, Theme } from 'emoji-picker-react';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/popover';
import { useTheme } from 'next-themes';

import { addReaction } from '@/lib/actions';
import { THEME } from '@/lib/constants';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function ReactionForm({ slug }: { slug: string }) {
  const { resolvedTheme } = useTheme();
  const onEmojiClick = async (reaction: EmojiClickData) => {
    await addReaction(reaction.emoji, slug);
  };

  return (
    <Popover classNames={{ content: 'px-0 py-0' }}>
      <PopoverTrigger>
        <button
          type="button"
          aria-label="Add reaction"
          className="inline-flex h-9 w-9 items-center justify-center rounded-button border border-dashed border-outline-subtle text-ink-muted transition-colors hover:border-brand hover:text-brand dark:border-carbon-border dark:text-carbon-muted"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-4 w-4"
            aria-hidden
          >
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <EmojiPicker
          open={true}
          skinTonesDisabled={true}
          autoFocusSearch={false}
          theme={resolvedTheme === THEME.DARK ? Theme.DARK : Theme.LIGHT}
          onEmojiClick={onEmojiClick}
        />
      </PopoverContent>
    </Popover>
  );
}
