import Link from 'next/link';
import LegacyBlogHint from './_components/legacy-blog-hint';

export default function NotFound() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-2">
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <Link
        href="/"
        className="mt-4 rounded-md bg-gray-800 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-600"
      >
        Go Back
      </Link>
      <LegacyBlogHint />
    </main>
  );
}
