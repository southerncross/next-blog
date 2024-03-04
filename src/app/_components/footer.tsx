import Container from '@/app/_components/container';
import { AUTHOR_NAME } from '@/lib/constants';

export function Footer() {
  return (
    <footer>
      <Container>
        <div className="flex flex-col items-center py-28 text-gray-400 lg:flex-row-reverse">
          {`Designed by ${AUTHOR_NAME} @ 2024`}
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
