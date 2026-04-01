'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getCertificate, Certificate } from '@/lib/api';

const S = {
  page: { minHeight: '100vh', background: '#f8fafc' } as React.CSSProperties,
  container: { maxWidth: '680px', margin: '0 auto', padding: '2.5rem 1.5rem' } as React.CSSProperties,
  back: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#6366f1', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.5rem' } as React.CSSProperties,
  card: { background: 'white', borderRadius: '1.25rem', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' } as React.CSSProperties,
  bar: { height: '4px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', margin: '-2rem -2rem 2rem', borderRadius: '0' } as React.CSSProperties,
  badge: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#dcfce7', color: '#16a34a', padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.25rem' } as React.CSSProperties,
  name: { fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' } as React.CSSProperties,
  titleText: { fontSize: '1.1rem', color: '#6366f1', fontWeight: 600, marginBottom: '2rem' } as React.CSSProperties,
  divider: { border: 'none', borderTop: '1px solid #f1f5f9', margin: '1.5rem 0' } as React.CSSProperties,
  row: { display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' } as React.CSSProperties,
  rowIcon: { width: '36px', height: '36px', borderRadius: '8px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 } as React.CSSProperties,
  rowLabel: { fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' } as React.CSSProperties,
  rowValue: { fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 } as React.CSSProperties,
  hashBlock: { background: '#0f172a', borderRadius: '0.75rem', padding: '1rem', marginTop: '1.5rem' } as React.CSSProperties,
  hashLabel: { fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em' } as React.CSSProperties,
  hashValue: { fontFamily: 'monospace', fontSize: '0.82rem', color: '#a5b4fc', wordBreak: 'break-all' as const, lineHeight: 1.6 } as React.CSSProperties,
  center: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' } as React.CSSProperties,
};

export default function CertificateDetailPage() {
  const { id } = useParams();
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCertificate(Number(id))
      .then(res => { if (res.success && res.data) setCert(res.data); else setError('Certificat introuvable'); })
      .catch(() => setError('Erreur de connexion'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <><Navbar /><div style={{ ...S.page, ...S.center }}>
      <div style={{ textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
        <p>Chargement...</p>
      </div>
    </div></>
  );

  if (error || !cert) return (
    <><Navbar /><div style={{ ...S.page, ...S.center }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '1rem', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Certificat introuvable</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{error}</p>
        <Link href="/certificates" style={{ padding: '0.65rem 1.5rem', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: 'white', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.875rem' }}>← Retour à la liste</Link>
      </div>
    </div></>
  );

  return (
    <><Navbar />
    <div style={S.page}>
      <div style={S.container}>
        <Link href="/certificates" style={S.back}>← Retour à la liste</Link>

        <div style={S.card}>
          <div style={S.bar} />

          <div style={S.badge}>✅ Certificat vérifié #{cert.id}</div>
          <h1 style={S.name}>{cert.student_name}</h1>
          <p style={S.titleText}>🏅 {cert.title}</p>

          <hr style={S.divider} />

          <div style={S.row}>
            <div style={S.rowIcon}>📅</div>
            <div>
              <div style={S.rowLabel}>Date d&apos;émission</div>
              <div style={S.rowValue}>{new Date(cert.issued_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
          </div>

          <div style={S.row}>
            <div style={S.rowIcon}>🕒</div>
            <div>
              <div style={S.rowLabel}>Enregistré le</div>
              <div style={S.rowValue}>{new Date(cert.created_at).toLocaleString('fr-FR')}</div>
            </div>
          </div>

          <div style={S.hashBlock}>
            <div style={S.hashLabel}>⛓️ Hash Blockchain (preuve d&apos;intégrité)</div>
            <div style={S.hashValue}>{cert.blockchain_hash}</div>
          </div>
        </div>
      </div>
    </div></>
  );
}
