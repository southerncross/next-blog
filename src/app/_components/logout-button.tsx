'use client';

export default function LogoutButton() {
  return (
    <a
      className="px-2 py-2 text-blue-700 hover:text-blue-600"
      href="/api/auth/logout"
    >
      Log out
    </a>
  );
}
