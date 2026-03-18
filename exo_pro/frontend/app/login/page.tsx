'use client';
// Page de connexion : formulaire email/mot de passe, redirige vers /events.
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
          <h1 className="text-4xl font-black text-white mb-2 text-center">🔐 Connexion</h1>
          <p className="text-gray-400 text-center mb-8">Accédez à votre espace</p>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
                placeholder="vous@exemple.com"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Connexion...' : '🚀 Se connecter'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
