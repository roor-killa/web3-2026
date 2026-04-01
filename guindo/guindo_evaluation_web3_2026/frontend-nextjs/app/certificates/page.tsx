'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getCertificates, deleteCertificate, Certificate } from '@/lib/api';

const S = {
  page: { minHeight: '100vh', background: '#f8fafc' } as React.CSSProperties,
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' } as React.CSSProperties,
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' } as React.CSSProperties,
  title: { fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0 } as React.CSSProperties,
  subtitle: { color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' } as React.CSSProperties,
  addBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: 'white', borderRadius: '0.75rem', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' } as React.CSSProperties,
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' } as React.CSSProperties,
  card: { background: 'white', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9', overflow: 'hidden' } as React.CSSProperties,
  cardBar: { height: '4px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' } as React.CSSProperties,
  cardBody: { padding: '1.25rem' } as React.CSSProperties,
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' } as React.CSSProperties,
  cardName: { fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 } as React.CSSProperties,
  cardId: { fontSize: '0.7rem', fontWeight: 700, color: '#6366f1', background: '#eef2ff', padding: '0.2rem 0.55rem', borderRadius: '999px' } as React.CSSProperties,
  cardTitle: { fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' } as React.CSSProperties,
  cardDate: { fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' } as React.CSSProperties,
  cardHash: { fontSize: '0.72rem', color: '#6366f1', background: '#eef2ff', padding: '0.35rem 0.6rem', borderRadius: '0.5rem', fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: '1rem' } as React.CSSProperties,
  btnRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' } as React.CSSProperties,
  btnDetail: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.6rem', background: 'white', color: '#475569', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' } as React.CSSProperties,
  btnDelete: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.5rem', border: '1px solid #fecaca', borderRadius: '0.6rem', background: '#fff5f5', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' } as React.CSSProperties,
  empty: { background: 'white', borderRadius: '1rem', padding: '4rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' } as React.CSSProperties,
  center: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' } as React.CSSProperties,
};

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getCertificates();
      if (res.success && res.data) setCerts(res.data);
      else setError('Erreur de chargement');
    } catch { setError('Impossible de contacter l\'API'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce certificat ?')) return;
    setDeleting(id);
    try {
      await deleteCertificate(id);
      setCerts(certs.filter(c => c.id !== id));
    } catch { alert('Erreur lors de la suppression'); }
    finally { setDeleting(null); }
  };

  if (loading) return (
    <><Navbar /><div style={{ ...S.page, ...S.center }}>
      <div style={{ textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
        <p style={{ fontWeight: 600 }}>Chargement des certificats...</p>
      </div>
    </div></>
  );

  if (error) return (
    <><Navbar /><div style={{ ...S.page, ...S.center }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '1rem', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
        <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Erreur de connexion</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{error}</p>
        <button onClick={load} style={{ padding: '0.65rem 1.5rem', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>🔄 Réessayer</button>
      </div>
    </div></>
  );

  return (
    <><Navbar />
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.header}>
          <div>
            <h1 style={S.title}>🎓 Certificats</h1>
            <p style={S.subtitle}>{certs.length} certificat{certs.length !== 1 ? 's' : ''} enregistré{certs.length !== 1 ? 's' : ''}</p>
          </div>
          <Link href="/certificates/create" style={S.addBtn}>➕ Nouveau certificat</Link>
        </div>

        {certs.length === 0 ? (
          <div style={S.empty}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📜</div>
            <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Aucun certificat</h3>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Créez votre premier certificat numérique</p>
            <Link href="/certificates/create" style={S.addBtn}>➕ Créer un certificat</Link>
          </div>
        ) : (
          <div style={S.grid}>
            {certs.map(cert => (
              <div key={cert.id} style={S.card}>
                <div style={S.cardBar} />
                <div style={S.cardBody}>
                  <div style={S.cardTop}>
                    <h3 style={S.cardName}>{cert.student_name}</h3>
                    <span style={S.cardId}>#{cert.id}</span>
                  </div>
                  <p style={S.cardTitle}>🏅 {cert.title}</p>
                  <p style={S.cardDate}>📅 Émis le {new Date(cert.issued_at).toLocaleDateString('fr-FR')}</p>
                  <div style={S.cardHash}>⛓️ {cert.blockchain_hash}</div>
                  <div style={S.btnRow}>
                    <Link href={`/certificates/${cert.id}`} style={S.btnDetail}>🔍 Détails</Link>
                    <button onClick={() => handleDelete(cert.id)} disabled={deleting === cert.id} style={S.btnDelete}>
                      {deleting === cert.id ? '⏳...' : '🗑️ Supprimer'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div></>
  );
}
