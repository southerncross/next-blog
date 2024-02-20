import Container from "@/app/_components/container";
import { Intro } from "@/app/_components/intro";
import { Posts } from "@/app/_components/posts";
import { getAllPosts } from "../lib/api";

export default function Index() {
  const allPosts = getAllPosts();

  return (
    <main>
      <Container>
        <Intro />
        <Posts posts={allPosts} />
      </Container>
    </main>
  );
}
