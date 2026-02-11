'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    created_at: string;
    updated_at: string;
}

/**
 * Page de détails d'un produit.
 * Utilise l'ID dynamique de l'URL pour charger les données via la méthode 'show' de l'API.
 */
export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Charge les détails du produit au montage du composant
    useEffect(() => {
        /**
         * Récupère les informations d'un produit unique depuis l'API.
         */
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/products/${productId}`);
                const data = await response.json();

                if (data.success) {
                    setProduct(data.data);
                } else {
                    setError('Produit non trouvé');
                }
            } catch (err) {
                setError('Impossible de se connecter au serveur');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to bottom right, #667eea 0%, #764ba2 100%)'
            }}>
                <div style={{ color: 'white', fontSize: '1.5rem' }}>
                    Chargement des détails du produit...
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to bottom right, #667eea 0%, #764ba2 100%)'
            }}>
                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '1rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    maxWidth: '400px'
                }}>
                    <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Erreur</h2>
                    <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{error || 'Produit non trouvé'}</p>
                    <Link
                        href="/products"
                        style={{
                            backgroundColor: '#667eea',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            textDecoration: 'none',
                            fontWeight: '600'
                        }}
                    >
                        Retour à la liste
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #667eea 0%, #764ba2 100%)',
            padding: '3rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                maxWidth: '800px',
                width: '100%',
                background: 'white',
                borderRadius: '1.5rem',
                padding: '3rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link
                        href="/products"
                        style={{
                            color: '#667eea',
                            textDecoration: 'none',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        ← Retour à la liste
                    </Link>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link
                            href={`/products/edit/${product.id}`}
                            style={{
                                color: '#1f2937',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                padding: '0.5rem 1rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontWeight: '500'
                            }}
                        >
                            Modifier
                        </Link>
                    </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                    <div style={{ flex: '1 1 300px' }}>
                        <div style={{
                            backgroundColor: '#f3f4f6',
                            aspectRatio: '1',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '4rem',
                            marginBottom: '1rem'
                        }}>
                            📦
                        </div>
                    </div>

                    <div style={{ flex: '2 1 400px' }}>
                        <span style={{
                            backgroundColor: '#e0e7ff',
                            color: '#4338ca',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            display: 'inline-block'
                        }}>
                            PRODUIT #{product.id}
                        </span>

                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            color: '#111827',
                            marginBottom: '0.5rem',
                            lineHeight: '1.2'
                        }}>
                            {product.name}
                        </h1>

                        <div style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            color: '#667eea',
                            marginBottom: '1.5rem'
                        }}>
                            {parseFloat(product.price).toFixed(2)}€
                        </div>

                        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                            <h2 style={{
                                fontSize: '1.125rem',
                                fontWeight: '700',
                                color: '#374151',
                                marginBottom: '0.75rem'
                            }}>
                                Description
                            </h2>
                            <p style={{
                                color: '#4b5563',
                                lineHeight: '1.8',
                                fontSize: '1.125rem'
                            }}>
                                {product.description || 'Aucune description disponible pour ce produit.'}
                            </p>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{
                                flex: '1',
                                padding: '1rem',
                                background: '#f9fafb',
                                borderRadius: '0.75rem',
                                border: '1px solid #f3f4f6'
                            }}>
                                <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Créé le</span>
                                <span style={{ fontWeight: '600', color: '#1f2937' }}>{new Date(product.created_at).toLocaleDateString()}</span>
                            </div>
                            <div style={{
                                flex: '1',
                                padding: '1rem',
                                background: '#f9fafb',
                                borderRadius: '0.75rem',
                                border: '1px solid #f3f4f6'
                            }}>
                                <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Mis à jour le</span>
                                <span style={{ fontWeight: '600', color: '#1f2937' }}>{new Date(product.updated_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
