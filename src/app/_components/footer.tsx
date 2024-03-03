import Container from "@/app/_components/container";
import { AUTHOR_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer>
      <Container>
        <div className="py-28 flex flex-col lg:flex-row-reverse items-center text-gray-400">
          {`Designed by ${AUTHOR_NAME} @ 2024`}
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
