'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { createCertificate } from '@/lib/api';

const S = {
  page: { minHeight: '100vh', background: '#f8fafc' } as React.CSSProperties,
  container: { maxWidth: '640px', margin: '0 auto', padding: '2.5rem 1.5rem' } as React.CSSProperties,
  back: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#6366f1', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.5rem' } as React.CSSProperties,
  card: { background: 'white', borderRadius: '1.25rem', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' } as React.CSSProperties,
  cardBar: { height: '4px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '2px', marginBottom: '1.5rem', margin: '-2rem -2rem 1.5rem' } as React.CSSProperties,
  title: { fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' } as React.CSSProperties,
  subtitle: { color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' } as React.CSSProperties,
  field: { marginBottom: '1.25rem' } as React.CSSProperties,
  label: { display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' } as React.CSSProperties,
  input: { width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '0.9rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' } as React.CSSProperties,
  hint: { fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.3rem' } as React.CSSProperties,
  genBtn: { marginTop: '0.4rem', padding: '0.4rem 0.8rem', fontSize: '0.78rem', fontWeight: 600, color: '#6366f1', background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '0.5rem', cursor: 'pointer' } as React.CSSProperties,
  submit: { width: '100%', padding: '0.75rem', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' } as React.CSSProperties,
  error: { background: '#fff5f5', border: '1px solid #fecaca', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem', marginBottom: '1rem' } as React.CSSProperties,
};

function generateHash(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function CreateCertificatePage() {
  const router = useRouter();
  const [form, setForm] = useState({ student_name: '', title: '', issued_at: '', blockchain_hash: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.student_name || !form.title || !form.issued_at || !form.blockchain_hash) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    setLoading(true);
    try {
      const res = await createCertificate(form);
      if (res.success && res.data) router.push(`/certificates/${res.data.id}`);
      else setError(res.message || 'Erreur lors de la création');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <><Navbar />
    <div style={S.page}>
      <div style={S.container}>
        <Link href="/certificates" style={S.back}>← Retour à la liste</Link>

        <div style={S.card}>
          <div style={S.cardBar} />
          <h1 style={S.title}>📜 Nouveau certificat</h1>
          <p style={S.subtitle}>Remplissez les informations du certificat numérique</p>

          {error && <div style={S.error}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={S.field}>
              <label style={S.label}>Nom de l&apos;étudiant</label>
              <input style={S.input} value={form.student_name} onChange={e => set('student_name', e.target.value)}
                placeholder="ex : Marie Dupont" />
            </div>

            <div style={S.field}>
              <label style={S.label}>Intitulé de la certification</label>
              <input style={S.input} value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="ex : Licence en Développement Web" />
            </div>

            <div style={S.field}>
              <label style={S.label}>Date d&apos;émission</label>
              <input type="date" style={S.input} value={form.issued_at} onChange={e => set('issued_at', e.target.value)} />
            </div>

            <div style={S.field}>
              <label style={S.label}>Hash blockchain</label>
              <input style={S.input} value={form.blockchain_hash} onChange={e => set('blockchain_hash', e.target.value)}
                placeholder="0x..." />
              <p style={S.hint}>Identifiant de preuve sur la blockchain (doit être unique)</p>
              <button type="button" style={S.genBtn} onClick={() => set('blockchain_hash', generateHash())}>
                ⚡ Générer un hash aléatoire
              </button>
            </div>

            <button type="submit" disabled={loading} style={S.submit}>
              {loading ? '⏳ Création en cours...' : '✅ Créer le certificat'}
            </button>
          </form>
        </div>
      </div>
    </div></>
  );
}
