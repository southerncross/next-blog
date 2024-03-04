'use client';

import { useState } from 'react';
import classNames from 'classnames';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Textarea } from '@nextui-org/input';

import { createComment } from '@/lib/actions';
import Avatar from './avatar';
import LogoutButton from './logout-button';
import LoginButton from './login-button';
import Spinner from './spinner';
import { Button } from '@nextui-org/react';

export default function CommentForm({ slug }: { slug: string }) {
  const { user, error, isLoading } = useUser();
  const [content, setContent] = useState('');
  const [pending, setPending] = useState(false);
  const createCommentWithSlug = async () => {
    if (pending || !user) {
      return;
    }

    setPending(true);
    await createComment(slug, content);
    setContent('');
    setPending(false);
  };

  if (isLoading) {
    return (
      <div className="mt-16 flex justify-center">
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
        <Avatar name={user.name || ''} picture={user.picture || ''} />
        <Textarea
          className="my-4 w-full md:ml-16 md:w-[calc(100%-64px)]"
          variant="bordered"
          value={content}
          placeholder="Add your comment..."
          onValueChange={setContent}
        />
      </div>
      <div className="mt-2 flex flex-row-reverse">
        <Button className="ml-2" onClick={createCommentWithSlug}>
          {pending && <Spinner color="white" />}
          <span className={classNames({ 'ml-2': pending })}>Submit</span>
        </Button>
        <LogoutButton />
      </div>
    </div>
  );
}
