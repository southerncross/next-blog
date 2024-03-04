import { usePathname } from 'next/navigation';

export default function () {
  const pathname = usePathname();

  return (
    <div className="mt-16 flex justify-center">
      <a
        className="px-2 py-2 text-blue-700 hover:text-blue-600"
        href={`/api/auth/login?returnTo=${encodeURIComponent(pathname)}`}
      >
        Log in
      </a>
      <span className="py-2">to leave a comment.</span>
    </div>
  );
}
