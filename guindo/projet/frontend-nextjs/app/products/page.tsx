'use client';

import { useEffect, useState } from 'react';

interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

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
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '3rem'
                }}>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '0.5rem'
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
                                paddingTop: '1rem'
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
