'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const S = {
  nav: { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' } as React.CSSProperties,
  inner: { maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' } as React.CSSProperties,
  logo: { display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' } as React.CSSProperties,
  logoIcon: { width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' } as React.CSSProperties,
  logoText: { fontWeight: 800, fontSize: '1.2rem', color: 'white', letterSpacing: '-0.5px' } as React.CSSProperties,
  links: { display: 'flex', alignItems: 'center', gap: '0.25rem' } as React.CSSProperties,
};

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/certificates', label: 'Certificats', icon: '🎓' },
    { href: '/certificates/create', label: 'Nouveau', icon: '➕' },
  ];

  return (
    <nav style={S.nav}>
      <div style={S.inner}>
        <Link href="/certificates" style={S.logo}>
          <div style={S.logoIcon}>⛓️</div>
          <span style={S.logoText}>
            Certi<span style={{ background: 'linear-gradient(90deg, #a5b4fc, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chain</span>
          </span>
        </Link>

        <div style={S.links}>
          {links.map(({ href, label, icon }) => {
            const active = pathname === href || pathname?.startsWith(href + '/');
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 1rem', borderRadius: '0.75rem',
                textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem',
                transition: 'all 0.2s',
                background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.65)',
              }}>
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
