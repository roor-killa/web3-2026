'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { apiGet, apiPut, ApiResponse } from '@/lib/api';

interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
}

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProduct, setIsLoadingProduct] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await apiGet<ApiResponse<Product>>(`/products/${productId}`);
                if (data.success && data.data) {
                    setName(data.data.name);
                    setPrice(data.data.price);
                    setDescription(data.data.description);
                } else {
                    setError('Produit non trouvé');
                }
            } catch {
                setError('Impossible de charger le produit');
            } finally {
                setIsLoadingProduct(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setIsLoading(true);

        try {
            const data = await apiPut<ApiResponse>(`/products/${productId}`, {
                name,
                price: parseFloat(price),
                description,
            });

            if (data.success) {
                setSuccess(true);
                setTimeout(() => router.push('/products'), 1200);
            } else {
                setError(data.message || 'Erreur lors de la modification');
            }
        } catch {
            setError('Impossible de se connecter au serveur');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingProduct) {
        return (
            <>
                <Navbar />
                <div className="page-gradient flex items-center justify-center section">
                    <div className="glass rounded-2xl px-10 py-8 flex flex-col items-center gap-4 text-white animate-pulse-slow">
                        <svg className="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        <span className="font-semibold text-lg">Chargement du produit...</span>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="page-gradient flex items-center justify-center p-6 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                <div className="w-full max-w-lg relative animate-slide-up">
                    {/* Back link */}
                    <Link href="/products" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-6 transition">
                        ← Retour aux produits
                    </Link>

                    <div className="card p-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-7">
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                                    <span>✏️</span> Modifier le Produit
                                </h1>
                                <p className="text-slate-500 text-sm mt-1">ID #{productId}</p>
                            </div>
                            <Link href="/products" className="text-slate-400 hover:text-slate-600 transition text-sm font-medium">
                                Annuler ✕
                            </Link>
                        </div>

                        {/* Alerts */}
                        {error && (
                            <div className="alert-error mb-5 animate-fade-in">
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="alert-success mb-5 animate-scale-in">
                                <span>✅</span>
                                <span>Produit modifié avec succès ! Redirection...</span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="input-label">
                                    Nom du produit
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📝</span>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        placeholder="Ex: MacBook Pro"
                                        className="input-field pl-9"
                                    />
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <label htmlFor="price" className="input-label">
                                    Prix (€)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                                    <input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                        placeholder="0.00"
                                        className="input-field pl-8"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="input-label">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    placeholder="Description détaillée du produit..."
                                    className="input-field resize-none"
                                />
                                <p className="text-xs text-slate-400 mt-1">{description.length} caractères</p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <Link href="/products" className="btn-secondary flex-1 justify-center py-3">
                                    Annuler
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isLoading || success}
                                    className="btn-primary flex-1 justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                            </svg>
                                            Enregistrement...
                                        </>
                                    ) : success ? '✅ Enregistré!' : '💾 Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
