'use client';

import { useEffect, useState } from 'react';
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
 * Page d'affichage de la liste des produits.
 * Récupère les données depuis l'API Laravel et gère les opérations CRUD de base.
 */
export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState<number | null>(null);

    // Chargement initial des produits au montage du composant
    useEffect(() => {
        fetchProducts();
    }, []);

    /**
     * Récupère la liste complète des produits via l'API.
     */
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/products');
            const data = await response.json();

            if (data.success) {
                setProducts(data.data);
            } else {
                setError('Erreur lors du chargement des produits');
            }
        } catch (err) {
            setError('Impossible de se connecter au serveur');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Supprime un produit après confirmation utilisateur.
     * @param id Identifiant du produit à supprimer
     */
    const deleteProduct = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            return;
        }

        setDeleting(id);
        try {
            const response = await fetch(`http://localhost:8080/api/products/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                // Mise à jour de l'état local pour refléter la suppression sans recharger la page
                setProducts(products.filter(p => p.id !== id));
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (err) {
            alert('Erreur de connexion');
            console.error(err);
        } finally {
            setDeleting(null);
        }
    };

    // État de chargement initial
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
                    Chargement des produits...
                </div>
            </div>
        );
    }

    if (error) {
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
                    textAlign: 'center'
                }}>
                    <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Erreur</h2>
                    <p style={{ color: '#6b7280' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #667eea 0%, #764ba2 100%)',
            padding: '3rem 1rem'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header with Action */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '3rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            color: 'white',
                            marginBottom: '0.5rem',
                            lineHeight: '1.2'
                        }}>
                            Nos Produits
                        </h1>
                        <p style={{
                            fontSize: '1.25rem',
                            color: 'rgba(255, 255, 255, 0.9)'
                        }}>
                            Découvrez notre sélection de {products.length} produits
                        </p>
                    </div>

                    <Link
                        href="/products/create"
                        style={{
                            backgroundColor: 'white',
                            color: '#667eea',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            textDecoration: 'none',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            transition: 'transform 0.2s',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <span style={{ fontSize: '1.25rem' }}>+</span> Ajouter un produit
                    </Link>
                </div>

                {/* Products Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {products.map((product) => (
                        <div
                            key={product.id}
                            style={{
                                background: 'white',
                                borderRadius: '1rem',
                                padding: '1.5rem',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                            }}
                        >
                            {/* Product Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start',
                                marginBottom: '1rem'
                            }}>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: '#1f2937',
                                    margin: 0
                                }}>
                                    {product.name}
                                </h3>
                                <span style={{
                                    backgroundColor: '#667eea',
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    whiteSpace: 'nowrap'
                                }}>
                                    #{product.id}
                                </span>
                            </div>

                            {/* Description */}
                            <p style={{
                                color: '#6b7280',
                                marginBottom: '1.5rem',
                                lineHeight: '1.6',
                                minHeight: '3rem'
                            }}>
                                {product.description || 'Aucune description disponible'}
                            </p>

                            {/* Price */}
                            <div style={{
                                borderTop: '1px solid #e5e7eb',
                                paddingTop: '1rem',
                                marginBottom: '1rem'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{
                                        fontSize: '0.875rem',
                                        color: '#6b7280',
                                        fontWeight: '500'
                                    }}>
                                        Prix
                                    </span>
                                    <span style={{
                                        fontSize: '1.75rem',
                                        fontWeight: 'bold',
                                        color: '#667eea'
                                    }}>
                                        {parseFloat(product.price).toFixed(2)}€
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                                borderTop: '1px solid #e5e7eb',
                                paddingTop: '1rem'
                            }}>
                                <Link
                                    href={`/products/${product.id}`}
                                    style={{
                                        flex: '1 1 100%',
                                        backgroundColor: '#f3f4f6',
                                        color: '#374151',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.375rem',
                                        textDecoration: 'none',
                                        textAlign: 'center',
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s',
                                        border: '1px solid #d1d5db',
                                        marginBottom: '0.5rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#e5e7eb';
                                        e.currentTarget.style.borderColor = '#667eea';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                                        e.currentTarget.style.borderColor = '#d1d5db';
                                    }}
                                >
                                    🔍 Voir Détails
                                </Link>
                                <Link
                                    href={`/products/edit/${product.id}`}
                                    style={{
                                        flex: 1,
                                        backgroundColor: '#667eea',
                                        color: 'white',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.375rem',
                                        textDecoration: 'none',
                                        textAlign: 'center',
                                        fontWeight: '500',
                                        fontSize: '0.875rem',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5568d3'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
                                >
                                    ✏️ Modifier
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        deleteProduct(product.id);
                                    }}
                                    disabled={deleting === product.id}
                                    style={{
                                        flex: 1,
                                        backgroundColor: deleting === product.id ? '#d1d5db' : '#dc2626',
                                        color: 'white',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.375rem',
                                        border: 'none',
                                        fontWeight: '500',
                                        fontSize: '0.875rem',
                                        cursor: deleting === product.id ? 'not-allowed' : 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (deleting !== product.id) {
                                            e.currentTarget.style.backgroundColor = '#b91c1c';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (deleting !== product.id) {
                                            e.currentTarget.style.backgroundColor = '#dc2626';
                                        }
                                    }}
                                >
                                    {deleting === product.id ? '⏳ Suppression...' : '🗑️ Supprimer'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {products.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        background: 'white',
                        borderRadius: '1rem'
                    }}>
                        <h3 style={{ color: '#6b7280', fontSize: '1.25rem' }}>
                            Aucun produit disponible
                        </h3>
                    </div>
                )}
            </div>
        </div>
    );
}
