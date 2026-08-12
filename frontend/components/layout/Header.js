import Link from 'next/link';

export default function Header({ profile }) {
  const name = profile?.fullName || 'Portafolio Conversacional';

  return (
    <header className="flex items-center justify-between px-6 py-5 sm:px-10">
      <span className="font-display text-sm font-semibold tracking-tight text-paper">{name}</span>
      <Link
        href="/admin"
        className="transmission-label transition-colors hover:text-signal"
      >
        Admin →
      </Link>
    </header>
  );
}
