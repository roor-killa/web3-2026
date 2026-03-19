'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function WelcomeContent() {
    const searchParams = useSearchParams();
    const login = searchParams.get('login') || 'Invité';

    return (
        <div className="page-gradient flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

            <div className="w-full max-w-lg relative animate-scale-in">
                {/* Main card */}
                <div className="card p-10 text-center">
                    {/* Avatar / Icon */}
                    <div className="relative inline-block mb-6 animate-float">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-hero flex items-center justify-center shadow-glow-lg mx-auto">
                            <span className="text-5xl">👋</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
                    </div>

                    {/* Greeting */}
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                        Bonjour, <span className="text-gradient">{login}</span>!
                    </h1>
                    <p className="text-slate-500 text-lg mb-8">
                        Vous êtes connecté avec succès. Que souhaitez-vous faire ?
                    </p>

                    {/* Info pill */}
                    <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-medium px-4 py-2 rounded-full mb-8 border border-primary-100">
                        <span>✅</span>
                        Compte actif · {login}
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href="/products"
                            className="btn-primary justify-center py-4"
                        >
                            <span>📦</span>
                            <span>Voir les produits</span>
                        </Link>
                        <Link
                            href="/dashboard"
                            className="btn-secondary justify-center py-4"
                        >
                            <span>📊</span>
                            <span>Dashboard</span>
                        </Link>
                    </div>
                </div>

                {/* Quick links */}
                <div className="glass rounded-2xl p-4 mt-4 flex justify-center gap-6">
                    <Link href="/login" className="text-white/70 hover:text-white text-sm font-medium transition flex items-center gap-1">
                        <span>🔐</span> Reconfigurer
                    </Link>
                    <span className="text-white/20">|</span>
                    <a href="#" className="text-white/70 hover:text-white text-sm font-medium transition flex items-center gap-1">
                        <span>📖</span> Documentation
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function WelcomePage() {
    return (
        <Suspense fallback={
            <div className="page-gradient flex items-center justify-center">
                <div className="glass rounded-2xl px-8 py-6 flex items-center gap-4 text-white">
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="font-semibold">Chargement...</span>
                </div>
            </div>
        }>
            <WelcomeContent />
        </Suspense>
    );
}
