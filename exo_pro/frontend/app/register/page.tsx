'use client';
// Page d'inscription : créer un compte utilisateur, redirige vers /events.
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== passwordConf) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, passwordConf);
      router.push('/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
          <h1 className="text-4xl font-black text-white mb-2 text-center">✨ Inscription</h1>
          <p className="text-gray-400 text-center mb-8">Créez votre compte gratuitement</p>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Nom complet</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
                placeholder="Jean Dupont"
              />
            </div>
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
                minLength={8}
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
                placeholder="Minimum 8 caractères"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Confirmer le mot de passe</label>
              <input
                type="password"
                value={passwordConf}
                onChange={e => setPasswordConf(e.target.value)}
                required
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Inscription...' : '✅ Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
