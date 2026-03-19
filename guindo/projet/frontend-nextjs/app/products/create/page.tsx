'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { apiPost, ApiResponse } from '@/lib/api';

/**
 * Page de création d'un nouveau produit.
 * Fournit un formulaire pour saisir le nom, le prix et la description.
 */
export default function CreateProductPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Gère la soumission du formulaire de création.
     * Envoie les données en JSON à l'API Laravel.
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await apiPost<ApiResponse>('/products', {
                name,
                price: parseFloat(price),
                description,
            });

            if (data.success) {
                // Rediriger vers la liste des produits après succès
                router.push('/products');
                router.refresh(); // Rafraîchir les données de la page suivante
            } else {
                setError(data.message || 'Erreur lors de la création du produit');
            }
        } catch (err) {
            setError('Impossible de se connecter au serveur');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            ➕ Nouveau Produit
                        </h1>
                        <Link
                            href="/products"
                            className="text-gray-500 hover:text-gray-700 text-lg font-semibold transition"
                        >
                            ✕
                        </Link>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nom */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom du produit *
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Ex: MacBook Pro"
                                className="input-field"
                            />
                        </div>

                        {/* Prix */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prix (€) *
                            </label>
                            <input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                placeholder="0.00"
                                className="input-field"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Description détaillée du produit..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition resize-vertical"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-primary text-white py-2 px-4 rounded-md font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {isLoading ? '⏳ Création en cours...' : '✅ Créer le produit'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
