import type { Metadata } from 'next';

// Worlds and tasks require a session and may contain personal progress.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function WorldLayout({ children }: { children: React.ReactNode }) {
  return children;
}
