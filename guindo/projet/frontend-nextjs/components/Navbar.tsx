'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { logout } from '@/lib/auth';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error(error);
        }
    };

    const navLinks = [
        { href: '/products', label: 'Produits', icon: '📦' },
        // { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    ];

    return (
        <nav className="sticky top-0 z-50 glass-dark border-b border-white/10 shadow-glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link href="/products" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300 group-hover:scale-105">
                            <span className="text-lg">🛒</span>
                        </div>
                        <span className="font-extrabold text-white text-lg tracking-tight hidden sm:block">
                            Web<span className="text-gradient bg-clip-text bg-gradient-to-r from-primary-300 to-accent-500" style={{ WebkitTextFillColor: 'transparent', background: 'linear-gradient(90deg, #a5b4fc, #67e8f9)', WebkitBackgroundClip: 'text' }}>Store</span>
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex items-center gap-1">
                        {navLinks.map(({ href, label, icon }) => {
                            const isActive = pathname === href || pathname?.startsWith(href + '/');
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-white/20 text-white shadow-sm'
                                            : 'text-white/70 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    <span>{icon}</span>
                                    <span className="hidden sm:block">{label}</span>
                                </Link>
                            );
                        })}

                        <div className="w-px h-6 bg-white/20 mx-2" />

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-red-500/80 hover:bg-red-500 text-white transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                        >
                            <span>🚪</span>
                            <span className="hidden sm:block">Déconnexion</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}