import Container from '@/app/_components/container';
import { AUTHOR_NAME, GITHUB_URL } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-outline-subtle py-12 dark:border-carbon-border">
      <Container size="wide">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
            <span className="label-mono">
              © {new Date().getFullYear()} {AUTHOR_NAME}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="link-quiet text-sm"
            >
              GitHub
            </a>
            <span className="font-mono text-xs text-ink-subtle dark:text-carbon-muted">
              Built with Next.js
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
