'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TopMenuItemProps {
  title: string;
  pageRef: string;
}

export default function TopMenuItem({ title, pageRef }: TopMenuItemProps) {
  const pathname = usePathname();
  const isActive = pathname === pageRef;

  return (
    <Link
      href={pageRef}
      className={`px-4 py-2 rounded-lg transition-colors font-medium ${
        isActive
          ? 'bg-indigo-100 text-indigo-700'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {title}
    </Link>
  );
}