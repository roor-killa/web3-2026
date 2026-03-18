'use client';
// Barre de navigation dynamique : affiche les liens selon l'état de connexion.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="bg-indigo-700 text-white py-4 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-3">
        <Link href="/" className="text-2xl font-bold hover:text-indigo-200 transition-colors">
          🚀 E-Shop
        </Link>
        <div className="flex gap-4 items-center flex-wrap text-sm font-medium">
          <Link href="/" className="hover:text-indigo-200 transition-colors">Accueil</Link>
          <Link href="/products" className="hover:text-indigo-200 transition-colors">Produits</Link>

          {!loading && (
            user ? (
              <>
                <span className="border border-indigo-400 text-indigo-200 px-3 py-1 rounded-full">
                  👤 {user.name}{user.is_admin ? ' (admin)' : ''}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-400 px-4 py-1 rounded-lg font-bold transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-indigo-200 transition-colors">Connexion</Link>
                <Link
                  href="/register"
                  className="bg-white text-indigo-700 hover:bg-indigo-100 px-4 py-1 rounded-lg font-bold transition-colors"
                >
                  Inscription
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
