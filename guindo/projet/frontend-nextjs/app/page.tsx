import Link from 'next/link';

export default function Home() {
    return (
        <main style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #667eea 0%, #764ba2 100%)',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                maxWidth: '800px',
                width: '100%'
            }}>
                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '0.5rem'
                }}>
                    Web3 2026
                </h1>
                <h2 style={{
                    fontSize: '1.5rem',
                    color: '#667eea',
                    fontWeight: '600',
                    marginBottom: '1rem'
                }}>
                    Frontend Next.js
                </h2>
                <p style={{
                    fontSize: '1.125rem',
                    color: '#6b7280',
                    marginBottom: '3rem',
                    lineHeight: '1.75'
                }}>
                    Bienvenue sur la plateforme de gestion des produits. Explorez notre catalogue et gérez vos commandes avec facilité.
                </p>

                <div style={{
                    marginBottom: '3rem',
                    padding: '2rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '1rem',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '1.5rem'
                    }}>
                        Pages disponibles
                    </h3>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                    }}>
                        {/* <li>
                            <Link href="/login" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#667eea',
                                textDecoration: 'none',
                                fontWeight: '500',
                                fontSize: '1rem'
                            }}>
                                🔑 Connexion
                            </Link>
                        </li>
                        <li>
                            <Link href="/register" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#667eea',
                                textDecoration: 'none',
                                fontWeight: '500',
                                fontSize: '1rem'
                            }}>
                                📝 Créer un compte
                            </Link>
                        </li> */}
                        <li>
                            <Link href="/login" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#667eea',
                                textDecoration: 'none',
                                fontWeight: '500',
                                fontSize: '1rem'
                            }}>
                                📦 Liste des produits
                            </Link>
                        </li>
                    </ul>
                </div>

                <div style={{
                    padding: '2rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '1rem',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '1.5rem'
                    }}>
                        Services disponibles
                    </h3>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                    }}>
                        <li>
                            <span style={{ color: '#6b7280', fontWeight: '500' }}>🌐 Backend Laravel: </span>
                            <a href="http://localhost:8080" target="_blank" style={{
                                color: '#667eea',
                                textDecoration: 'none',
                                fontWeight: '600'
                            }}>
                                localhost:8080
                            </a>
                        </li>
                        <li>
                            <span style={{ color: '#6b7280', fontWeight: '500' }}>🐍 Backend FastAPI: </span>
                            <a href="http://localhost:8001" target="_blank" style={{
                                color: '#667eea',
                                textDecoration: 'none',
                                fontWeight: '600'
                            }}>
                                localhost:8001
                            </a>
                        </li>
                        <li>
                            <span style={{ color: '#6b7280', fontWeight: '500' }}>🗄️ pgAdmin: </span>
                            <a href="http://localhost:8081" target="_blank" style={{
                                color: '#667eea',
                                textDecoration: 'none',
                                fontWeight: '600'
                            }}>
                                localhost:8081
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
