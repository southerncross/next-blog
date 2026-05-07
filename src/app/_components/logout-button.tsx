'use client';

export default function LogoutButton() {
  return (
    <a
      className="font-mono text-xs uppercase tracking-wider text-ink-muted transition-colors hover:text-brand dark:text-carbon-muted"
      href="/api/auth/logout"
    >
      Log out
    </a>
  );
}
