'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ login, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Rediriger vers la page de bienvenue avec les données
                router.push(`/welcome?login=${encodeURIComponent(login)}`);
            } else {
                setError('Erreur lors de la connexion');
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom right, #667eea 0%, #764ba2 100%)',
            padding: '2rem'
        }}>
            <div style={{
                background: 'white',
                padding: '2.5rem',
                borderRadius: '1rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    color: '#1f2937'
                }}>
                    Connexion
                </h1>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                    Entrez vos identifiants pour continuer
                </p>

                {error && (
                    <div style={{
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        borderRadius: '0.5rem',
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label
                            htmlFor="login"
                            style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                marginBottom: '0.5rem',
                                color: '#374151'
                            }}
                        >
                            Login
                        </label>
                        <input
                            id="login"
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
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

                    <div style={{ marginBottom: '2rem' }}>
                        <label
                            htmlFor="password"
                            style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                marginBottom: '0.5rem',
                                color: '#374151'
                            }}
                        >
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#5568d3')}
                        onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#667eea')}
                    >
                        {isLoading ? 'Connexion...' : 'Valider'}
                    </button>
                </form>
            </div>
        </div>
    );
}
