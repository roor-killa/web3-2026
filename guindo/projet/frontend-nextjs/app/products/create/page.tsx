'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { apiPost, ApiResponse } from '@/lib/api';

export default function CreateProductPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(''); setIsLoading(true);
    try {
      const data = await apiPost<ApiResponse>('/products', { name, price: parseFloat(price), description });
      if (data.success) { router.push('/products'); router.refresh(); }
      else setError(data.message || 'Erreur lors de la création');
    } catch { setError('Impossible de se connecter'); }
    finally { setIsLoading(false); }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.65rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '0.9rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: '#f8fafc' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <><Navbar />
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          ← Retour aux produits
        </Link>

        <div style={{ background: 'white', borderRadius: '1.25rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ height: '4px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
          <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ➕ Nouveau Produit
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Remplissez les informations ci-dessous</p>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div><label style={labelStyle}>Nom du produit</label><input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Ex: MacBook Pro" style={inputStyle} /></div>
              <div><label style={labelStyle}>Prix (€)</label><input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} required placeholder="0.00" style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Description détaillée..." style={{ ...inputStyle, resize: 'vertical' }} />
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.25rem' }}>{description.length} caractères</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link href="/products" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', background: '#f1f5f9', color: '#475569', borderRadius: '0.75rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>Annuler</Link>
                <button type="submit" disabled={isLoading} style={{ flex: 1, padding: '0.75rem', background: isLoading ? '#a5b4fc' : 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                  {isLoading ? '⏳ Création...' : '✅ Créer le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div></>
  );
}
