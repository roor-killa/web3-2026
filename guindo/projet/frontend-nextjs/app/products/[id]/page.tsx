'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { apiGet, ApiResponse } from '@/lib/api';

interface Product { id: number; name: string; price: string; description: string; created_at: string; updated_at: string; }

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await apiGet<ApiResponse<Product>>(`/products/${productId}`);
        if (data.success && data.data) setProduct(data.data);
        else setError('Produit non trouvé');
      } catch { setError('Impossible de se connecter'); }
      finally { setLoading(false); }
    };
    if (productId) fetch();
  }, [productId]);

  const pageStyle: React.CSSProperties = { minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' };

  if (loading) return (
    <><Navbar /><div style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#64748b' }}><div style={{ fontSize: '2rem' }}>⏳</div><p>Chargement...</p></div>
    </div></>
  );

  if (error || !product) return (
    <><Navbar /><div style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '1rem', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
        <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Produit introuvable</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{error}</p>
        <Link href="/products" style={{ padding: '0.65rem 1.5rem', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: 'white', borderRadius: '0.75rem', textDecoration: 'none', fontWeight: 700 }}>← Retour</Link>
      </div>
    </div></>
  );

  return (
    <><Navbar />
    <div style={pageStyle}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          ← Retour aux produits
        </Link>

        <div style={{ background: 'white', borderRadius: '1.25rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ height: '4px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
          <div style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Image */}
            <div style={{ flexShrink: 0 }}>
              <div style={{ width: '180px', height: '180px', background: 'linear-gradient(135deg, #f0f4ff, #e8edff)', borderRadius: '1rem', border: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>📦</div>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: '250px' }}>
              <span style={{ display: 'inline-block', background: '#eef2ff', color: '#4338ca', fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                Produit #{product.id}
              </span>

              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem', lineHeight: 1.2 }}>{product.name}</h1>

              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6366f1', marginBottom: '1.25rem' }}>
                {parseFloat(product.price).toFixed(2)}€
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Description</p>
                <p style={{ color: '#475569', lineHeight: 1.7, margin: 0 }}>
                  {product.description || 'Aucune description disponible.'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Créé le', value: new Date(product.created_at).toLocaleDateString('fr-FR') },
                  { label: 'Mis à jour le', value: new Date(product.updated_at).toLocaleDateString('fr-FR') },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: '#f8fafc', borderRadius: '0.75rem', padding: '0.75rem 1rem', border: '1px solid #f1f5f9' }}>
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.25rem', fontWeight: 700 }}>{label}</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link href={`/products/edit/${product.id}`}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: 'white', borderRadius: '0.75rem', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                  ✏️ Modifier
                </Link>
                <Link href="/products"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: '#f1f5f9', color: '#475569', borderRadius: '0.75rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
                  ← Retour
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div></>
  );
}
