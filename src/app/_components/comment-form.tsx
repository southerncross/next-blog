'use client';

import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import clsx from 'clsx';

import { createComment } from '@/lib/actions';
import Avatar from './avatar';
import LogoutButton from './logout-button';
import LoginButton from './login-button';
import Spinner from './spinner';

export default function CommentForm({ slug }: { slug: string }) {
  const { user, error, isLoading } = useUser();
  const [content, setContent] = useState('');
  const [pending, setPending] = useState(false);
  const createCommentWithSlug = async () => {
    if (pending || !user || !content.trim()) {
      return;
    }

    setPending(true);
    await createComment(slug, content);
    setContent('');
    setPending(false);
  };

  if (isLoading) {
    return (
      <div className="mt-10 flex justify-center">
        <Spinner color="gray" />
      </div>
    );
  }

  if (error || !user) {
    return <LoginButton />;
  }

  return (
    <div className="card-surface p-5 md:p-6">
      <Avatar name={user.name || ''} picture={user.picture || ''} />
      <textarea
        className="mt-4 block w-full resize-y rounded-button border border-outline bg-canvas-surface p-3 text-[15px] leading-relaxed text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-carbon-border dark:bg-carbon-surface dark:text-carbon-text dark:placeholder:text-carbon-muted"
        rows={4}
        value={content}
        placeholder="Add your comment..."
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="mt-4 flex items-center justify-between">
        <LogoutButton />
        <button
          type="button"
          className={clsx(
            'btn-primary',
            (pending || !content.trim()) && 'pointer-events-none opacity-60',
          )}
          onClick={createCommentWithSlug}
        >
          {pending && <Spinner color="white" />}
          <span className={clsx({ 'ml-2': pending })}>Submit</span>
        </button>
      </div>
    </div>
  );
}
