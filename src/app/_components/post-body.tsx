type Props = {
  content: string;
};

export function PostBody({ content }: Props) {
  return (
    <div className="post-body" dangerouslySetInnerHTML={{ __html: content }} />
  );
}
