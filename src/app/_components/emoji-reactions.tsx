import EmojiPicker from "./emoji-picker";

export default function EmojiReactions({ slug }: { slug: string }) {
  const handleReaction = (reaction: string) => {
    console.log(reaction);
  };

  return (
    <section className="flex justify-center py-12">
      <EmojiPicker
      reactionsDefaultOpen={true} />
    </section>
  );
}
