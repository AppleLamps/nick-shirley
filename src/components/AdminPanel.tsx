import Link from 'next/link';

export default function AdminPanel() {
  return (
    <Link
      href="/admin"
      className="text-gray-400 hover:text-gray-600 text-xs font-sans ml-2 underline"
      title="Admin"
    >
      [Admin]
    </Link>
  );
}
