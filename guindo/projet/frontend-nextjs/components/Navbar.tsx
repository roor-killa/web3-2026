'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <nav style={{
            background: 'linear-gradient(to right, #667eea 0%, #764ba2 100%)',
            padding: '0.75rem 2rem',
            height: 'auto',
            minHeight: '70px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            {/* Logo */}
            <Link href="/products" style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold'
            }}>
                <span style={{ fontSize: '1.75rem' }}>📦</span>
                WebStore
            </Link>

            {/* Menu */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem'
            }}>
                <Link href="/products" style={{
                    textDecoration: 'none',
                    color: 'white',
                    fontWeight: '500',
                    fontSize: '0.95rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    📋 Produits
                </Link>

                {/* <Link href="/products/create" style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '0.95rem',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                >
                    ➕ Ajouter
                </Link> */}

                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '0.95rem',
                        transition: 'background-color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ef5350'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff6b6b'}
                >
                    🚪 Déconnexion
                </button>
            </div>
        </nav>
    );
}