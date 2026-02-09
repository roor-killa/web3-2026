'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateProductPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    price: parseFloat(price),
                    description,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
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
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #667eea 0%, #764ba2 100%)',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                background: 'white',
                padding: '2.5rem',
                borderRadius: '1rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '500px'
            }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: 'bold',
                        color: '#1f2937'
                    }}>
                        Nouveau Produit
                    </h1>
                    <Link
                        href="/products"
                        style={{
                            color: '#6b7280',
                            textDecoration: 'none',
                            fontSize: '0.875rem'
                        }}
                    >
                        ✕ Annuler
                    </Link>
                </div>

                {error && (
                    <div style={{
                        padding: '0.75rem',
                        marginBottom: '1.5rem',
                        borderRadius: '0.5rem',
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Nom */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label
                            htmlFor="name"
                            style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                marginBottom: '0.5rem',
                                color: '#374151'
                            }}
                        >
                            Nom du produit
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Ex: MacBook Pro"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>

                    {/* Prix */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label
                            htmlFor="price"
                            style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                marginBottom: '0.5rem',
                                color: '#374151'
                            }}
                        >
                            Prix (€)
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
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label
                            htmlFor="description"
                            style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                marginBottom: '0.5rem',
                                color: '#374151'
                            }}
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Description détaillée du produit..."
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                resize: 'vertical',
                                outline: 'none',
                                transition: 'all 0.2s',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: isLoading ? '#9ca3af' : '#667eea',
                            color: 'white',
                            fontWeight: '600',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            transition: 'background-color 0.2s',
                            boxShadow: '0 4px 6px -1px rgba(102, 126, 234, 0.4)'
                        }}
                        onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#5568d3')}
                        onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#667eea')}
                    >
                        {isLoading ? 'Création en cours...' : 'Créer le produit'}
                    </button>
                </form>
            </div>
        </div>
    );
}
