'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function WelcomeContent() {
    const searchParams = useSearchParams();
    const login = searchParams.get('login') || 'Invité';

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
                padding: '3rem',
                borderRadius: '1rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                textAlign: 'center',
                maxWidth: '500px',
                width: '100%'
            }}>
                <div style={{
                    fontSize: '4rem',
                    marginBottom: '1rem'
                }}>
                    👋
                </div>

                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    color: '#1f2937'
                }}>
                    Bonjour {login}!
                </h1>

                <p style={{
                    color: '#6b7280',
                    fontSize: '1.125rem',
                    marginBottom: '2rem',
                    lineHeight: '1.75'
                }}>
                    Vous êtes maintenant connecté avec succès à l'application.
                </p>

                <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.5rem',
                    marginBottom: '2rem'
                }}>
                    <p style={{
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.5rem'
                    }}>
                        Informations de connexion:
                    </p>
                    <p style={{ color: '#6b7280' }}>
                        <strong>Login:</strong> {login}
                    </p>
                </div>

                <Link
                    href="/login"
                    style={{
                        display: 'inline-block',
                        padding: '0.75rem 2rem',
                        backgroundColor: '#667eea',
                        color: 'white',
                        fontWeight: '600',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5568d3'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
                >
                    Retour à la connexion
                </Link>
            </div>
        </div>
    );
}

export default function WelcomePage() {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to bottom right, #667eea 0%, #764ba2 100%)'
            }}>
                <div style={{ color: 'white', fontSize: '1.25rem' }}>
                    Chargement...
                </div>
            </div>
        }>
            <WelcomeContent />
        </Suspense>
    );
}
