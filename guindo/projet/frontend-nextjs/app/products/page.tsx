'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { apiGet, apiDelete, ApiResponse } from '@/lib/api';

interface Product {
  id: number; name: string; price: string;
  description: string; created_at: string; updated_at: string;
}

const S = {
  page: { minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' } as React.CSSProperties,
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' } as React.CSSProperties,
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' } as React.CSSProperties,
  title: { fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' } as React.CSSProperties,
  subtitle: { color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' } as React.CSSProperties,
  addBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: 'white', borderRadius: '0.75rem', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem', boxShadow: '0 4px 12px rgba(99,102,241,0.35)', whiteSpace: 'nowrap' } as React.CSSProperties,
  searchWrap: { marginBottom: '2rem' } as React.CSSProperties,
  searchInput: { width: '100%', maxWidth: '360px', padding: '0.65rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#0f172a', background: 'white', outline: 'none', boxSizing: 'border-box' } as React.CSSProperties,
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' } as React.CSSProperties,
  card: { background: 'white', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s, transform 0.2s' } as React.CSSProperties,
  cardBar: { height: '4px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' } as React.CSSProperties,
  cardBody: { padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 } as React.CSSProperties,
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' } as React.CSSProperties,
  cardName: { fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0, flex: 1, lineHeight: 1.3 } as React.CSSProperties,
  cardId: { fontSize: '0.7rem', fontWeight: 700, color: '#6366f1', background: '#eef2ff', padding: '0.2rem 0.55rem', borderRadius: '999px', marginLeft: '0.5rem', whiteSpace: 'nowrap' } as React.CSSProperties,
  cardDesc: { fontSize: '0.82rem', color: '#64748b', margin: '0.5rem 0 1rem', lineHeight: 1.5, flex: 1 } as React.CSSProperties,
  cardPriceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', marginBottom: '1rem' } as React.CSSProperties,
  cardPriceLabel: { fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 } as React.CSSProperties,
  cardPrice: { fontSize: '1.5rem', fontWeight: 800, color: '#6366f1' } as React.CSSProperties,
  btnRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' } as React.CSSProperties,
  btnDetail: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.6rem', background: 'white', color: '#475569', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' } as React.CSSProperties,
  btnEdit: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.5rem', border: 'none', borderRadius: '0.6rem', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: 'white', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', cursor: 'pointer' } as React.CSSProperties,
  btnDelete: { width: '100%', padding: '0.5rem', border: '1px solid #fecaca', borderRadius: '0.6rem', background: '#fff5f5', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' } as React.CSSProperties,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const data = await apiGet<ApiResponse<Product[]>>('/products');
      if (data.success && data.data) setProducts(data.data);
      else setError('Erreur lors du chargement');
    } catch { setError('Impossible de se connecter'); }
    finally { setLoading(false); }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return;
    setDeleting(id);
    try {
      const data = await apiDelete<ApiResponse>(`/products/${id}`);
      if (data.success) setProducts(products.filter(p => p.id !== id));
    } catch { alert('Erreur'); }
    finally { setDeleting(null); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <><Navbar /><div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
        <p>Chargement des produits...</p>
      </div>
    </div></>
  );

  if (error) return (
    <><Navbar /><div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '1rem', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
        <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Connexion impossible</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{error}</p>
        <button onClick={fetchProducts} style={{ padding: '0.65rem 1.5rem', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>🔄 Réessayer</button>
      </div>
    </div></>
  );

  return (
    <><Navbar />
    <div style={S.page}>
      <div style={S.container}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.title}>📦 Nos Produits</h1>
            <p style={S.subtitle}>{filtered.length} produit{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <Link href="/products/create" style={S.addBtn}>➕ Ajouter</Link>
        </div>

        {/* Search */}
        <div style={S.searchWrap}>
          <input type="text" placeholder="🔍 Rechercher un produit..." value={search}
            onChange={e => setSearch(e.target.value)} style={S.searchInput} />
        </div>

        {/* Empty */}
        {filtered.length === 0 && (
          <div style={{ background: 'white', borderRadius: '1rem', padding: '4rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>{search ? 'Aucun résultat' : 'Aucun produit'}</h3>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>{search ? `Aucun produit ne correspond à "${search}"` : 'Créez votre premier produit'}</p>
            {!search && <Link href="/products/create" style={S.addBtn}>➕ Créer</Link>}
          </div>
        )}

        {/* Grid */}
        <div style={S.grid}>
          {filtered.map(product => (
            <div key={product.id} style={S.card}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(99,102,241,0.15)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
            >
              <div style={S.cardBar} />
              <div style={S.cardBody}>
                <div style={S.cardTop}>
                  <h3 style={S.cardName}>{product.name}</h3>
                  <span style={S.cardId}>#{product.id}</span>
                </div>
                <p style={S.cardDesc}>{product.description || 'Aucune description disponible.'}</p>
                <div style={S.cardPriceRow}>
                  <span style={S.cardPriceLabel}>Prix</span>
                  <span style={S.cardPrice}>{parseFloat(product.price).toFixed(2)}€</span>
                </div>
                <div style={S.btnRow}>
                  <Link href={`/products/${product.id}`} style={S.btnDetail}>🔍 Détails</Link>
                  <Link href={`/products/edit/${product.id}`} style={S.btnEdit}>✏️ Modifier</Link>
                </div>
                <button onClick={() => deleteProduct(product.id)} disabled={deleting === product.id} style={S.btnDelete}>
                  {deleting === product.id ? '⏳ Suppression...' : '🗑️ Supprimer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div></>
  );
}
