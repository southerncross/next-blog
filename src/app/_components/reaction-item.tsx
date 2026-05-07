'use client';

import { useState } from 'react';
import clsx from 'clsx';
import confetti from 'canvas-confetti';

import { Reaction } from '@/interfaces/reaction';
import { addReaction } from '@/lib/actions';
import Spinner from './spinner';

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
    confetti();
  };

  return (
    <button
      type="button"
      onClick={onReactionClick}
      disabled={isPending}
      aria-busy={isPending}
      className="inline-flex h-9 items-center gap-2 rounded-button border border-outline-subtle bg-canvas-surface px-3 text-sm transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-60 dark:border-carbon-border dark:bg-carbon-surface"
    >
      <span className="text-base leading-none">{emoji}</span>
      {isPending ? (
        <Spinner />
      ) : (
        <span
          className={clsx(
            'font-mono text-xs tabular-nums text-ink-muted dark:text-carbon-muted',
            { hidden: count <= 0 },
          )}
        >
          {count < 1000 ? count : '999+'}
        </span>
      )}
    </button>
  );
}
