import Link from 'next/link';

export default function Home() {
    const services = [
        { label: '🌐 Backend Laravel', url: 'http://localhost:8080', port: 'localhost:8080', color: 'from-orange-500 to-red-500' },
        { label: '🐍 Backend FastAPI', url: 'http://localhost:8001', port: 'localhost:8001', color: 'from-green-500 to-teal-500' },
        { label: '🗄️ pgAdmin', url: 'http://localhost:8081', port: 'localhost:8081', color: 'from-blue-500 to-cyan-500' },
    ];

    const pages = [
        { href: '/login', icon: '🔐', label: 'Connexion', desc: 'Accéder à votre compte' },
        { href: '/register', icon: '📝', label: 'Inscription', desc: 'Créer un nouveau compte' },
        { href: '/products', icon: '📦', label: 'Produits', desc: 'Voir le catalogue' },
    ];

    return (
        <main className="page-gradient flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="absolute top-16 right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-16 left-16 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-2xl relative animate-slide-up">
                {/* Hero */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-sm border border-white/30 mb-5 shadow-glass animate-float">
                        <span className="text-4xl">🛒</span>
                    </div>
                    <h1 className="text-5xl font-extrabold text-white tracking-tight mb-2">
                        Web<span style={{color: '#a5b4fc'}}>Store</span>
                    </h1>
                    <p className="text-white/70 text-lg">
                        Plateforme de gestion des produits · Web3 2026
                    </p>
                </div>

                {/* Navigation cards */}
                <div className="card p-6 mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Pages disponibles</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {pages.map(({ href, icon, label, desc }) => (
                            <Link
                                key={href}
                                href={href}
                                className="group p-4 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50 transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <div className="text-2xl mb-2">{icon}</div>
                                <div className="font-semibold text-slate-800 text-sm group-hover:text-primary-700">{label}</div>
                                <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Services */}
                <div className="card p-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Services disponibles</h2>
                    <div className="space-y-3">
                        {services.map(({ label, url, port, color }) => (
                            <a
                                key={url}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-150 group"
                            >
                                <div className="font-medium text-slate-700 text-sm">{label}</div>
                                <span className={`text-xs font-mono font-semibold px-3 py-1 rounded-full text-white bg-gradient-to-r ${color} group-hover:shadow-md transition-shadow`}>
                                    {port} →
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
