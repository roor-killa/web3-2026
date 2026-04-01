'use client';
import Link from 'next/link';

export default function Home() {
  const pages = [
    // { href: '/login', icon: '🔐', label: 'Connexion', desc: 'Accéder à votre compte Laravel' },
    // { href: '/register', icon: '📝', label: 'Inscription', desc: 'Créer un nouveau compte Laravel' },
    { href: '/login', icon: '📦', label: 'Produits', desc: 'Voir le catalogue' },
    { href: '/dashboard/login', icon: '📊', label: 'Dashboard', desc: 'Tableau de bord FastAPI' },
  ];

  const services = [
    { label: '🌐 Backend Laravel', url: 'http://localhost:8080', port: 'localhost:8080', color: '#f97316' },
    { label: '🐍 Backend FastAPI', url: 'http://localhost:8000', port: 'localhost:8000', color: '#10b981' },
    { label: '🗄️ pgAdmin', url: 'http://localhost:8081', port: 'localhost:8081', color: '#3b82f6' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: '640px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px', height: '80px', margin: '0 auto 1.25rem',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1.5rem',
            border: '1px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}>🛒</div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'white', margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>
            Web<span style={{ color: '#a5b4fc' }}>Store</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', margin: 0 }}>
            Plateforme de gestion des produits · Web3 2026
          </p>
        </div>

        {/* Nav cards */}
        <div style={{
          background: 'white', borderRadius: '1.25rem', padding: '1.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)', marginBottom: '1rem',
        }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', marginTop: 0 }}>
            Pages disponibles
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {pages.map(({ href, icon, label, desc }) => (
              <Link key={href} href={href} style={{
                display: 'block', padding: '1rem', borderRadius: '0.875rem',
                border: '1px solid #f1f5f9', textDecoration: 'none',
                background: 'white', transition: 'all 0.15s ease',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#c7d2fe';
                  (e.currentTarget as HTMLElement).style.background = '#f5f3ff';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#f1f5f9';
                  (e.currentTarget as HTMLElement).style.background = 'white';
                  (e.currentTarget as HTMLElement).style.transform = 'none';
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b', marginBottom: '0.2rem' }}>{label}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>{desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Services */}
        <div style={{
          background: 'white', borderRadius: '1.25rem', padding: '1.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', marginTop: 0 }}>
            Services disponibles
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {services.map(({ label, url, port, color }) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.75rem 1rem', borderRadius: '0.75rem', textDecoration: 'none',
                transition: 'background 0.15s ease',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f8fafc'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>{label}</span>
                <span style={{
                  fontSize: '0.75rem', fontWeight: 700, fontFamily: 'monospace',
                  padding: '0.25rem 0.75rem', borderRadius: '999px',
                  background: color, color: 'white',
                  boxShadow: `0 2px 8px ${color}66`,
                }}>
                  {port} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
