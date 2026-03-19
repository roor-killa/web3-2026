'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { apiGet, apiDelete, ApiResponse } from '@/lib/api';

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
    const [deleting, setDeleting] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await apiGet<ApiResponse<Product[]>>('/products');
            if (data.success && data.data) {
                setProducts(data.data);
            } else {
                setError('Erreur lors du chargement des produits');
            }
        } catch {
            setError('Impossible de se connecter au serveur');
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
        setDeleting(id);
        try {
            const data = await apiDelete<ApiResponse>(`/products/${id}`);
            if (data.success) {
                setProducts(products.filter(p => p.id !== id));
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch {
            alert('Erreur de connexion');
        } finally {
            setDeleting(null);
        }
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="page-light section">
                    <div className="container-app">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1,2,3,4,5,6].map(i => (
                                <div key={i} className="card p-6">
                                    <div className="skeleton h-6 w-3/4 mb-3" />
                                    <div className="skeleton h-4 w-full mb-2" />
                                    <div className="skeleton h-4 w-2/3 mb-6" />
                                    <div className="skeleton h-8 w-1/3 mb-4" />
                                    <div className="skeleton h-10 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="page-light flex items-center justify-center section">
                    <div className="card p-10 text-center max-w-md w-full animate-scale-in">
                        <div className="text-5xl mb-4">❌</div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Connexion impossible</h2>
                        <p className="text-slate-500 mb-6">{error}</p>
                        <button onClick={fetchProducts} className="btn-primary">
                            🔄 Réessayer
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="page-light">
                <div className="section">
                    <div className="container-app">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 animate-fade-in">
                            <div>
                                <h1 className="page-title flex items-center gap-3">
                                    <span className="text-4xl">📦</span>
                                    Nos Produits
                                </h1>
                                <p className="page-subtitle">
                                    {filtered.length} produit{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <Link href="/products/create" className="btn-primary shrink-0">
                                ➕ Ajouter un produit
                            </Link>
                        </div>

                        {/* Search bar */}
                        <div className="mb-8 animate-fade-in">
                            <div className="relative max-w-md">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="input-field pl-11 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Empty state */}
                        {filtered.length === 0 && (
                            <div className="card p-16 text-center animate-scale-in">
                                <div className="text-6xl mb-4">📭</div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">
                                    {search ? 'Aucun résultat' : 'Aucun produit'}
                                </h3>
                                <p className="text-slate-500 mb-6">
                                    {search ? `Aucun produit ne correspond à "${search}"` : 'Commencez par créer votre premier produit'}
                                </p>
                                {!search && (
                                    <Link href="/products/create" className="btn-primary inline-flex">
                                        ➕ Créer un produit
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* Products grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
                            {filtered.map((product) => (
                                <div
                                    key={product.id}
                                    className="card-hover flex flex-col animate-fade-in"
                                >
                                    {/* Color bar */}
                                    <div className="h-1.5 bg-gradient-primary rounded-t-2xl" />

                                    <div className="p-6 flex flex-col flex-1">
                                        {/* Top row */}
                                        <div className="flex justify-between items-start gap-3 mb-3">
                                            <h3 className="text-lg font-bold text-slate-900 line-clamp-2 flex-1">
                                                {product.name}
                                            </h3>
                                            <span className="badge-info shrink-0">#{product.id}</span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-slate-500 text-sm line-clamp-3 flex-1 mb-4">
                                            {product.description || 'Aucune description disponible.'}
                                        </p>

                                        {/* Price */}
                                        <div className="flex items-center justify-between py-3 border-t border-slate-100 mb-4">
                                            <span className="text-sm text-slate-500 font-medium">Prix</span>
                                            <span className="text-2xl font-extrabold text-primary-600">
                                                {parseFloat(product.price).toFixed(2)}<span className="text-lg">€</span>
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <Link
                                                    href={`/products/${product.id}`}
                                                    className="btn btn-ghost btn-sm border border-slate-200 text-slate-600 hover:border-slate-300 justify-center"
                                                >
                                                    🔍 Détails
                                                </Link>
                                                <Link
                                                    href={`/products/edit/${product.id}`}
                                                    className="btn btn-sm bg-primary-500 text-white hover:bg-primary-600 justify-center"
                                                >
                                                    ✏️ Modifier
                                                </Link>
                                            </div>
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                disabled={deleting === product.id}
                                                className="btn-danger btn-sm w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {deleting === product.id ? (
                                                    <>
                                                        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                                        </svg>
                                                        Suppression...
                                                    </>
                                                ) : '🗑️ Supprimer'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
