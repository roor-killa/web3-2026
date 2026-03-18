'use client';
// Page création d'événement (admin uniquement).
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:8000/api';

export default function CreateEventPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    event_date: '',
    max_participants: 100,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authLoading && (!user || !user.is_admin)) {
    router.push('/events');
    return null;
  }

  const set = (field: string, value: string | number) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors de la création');
      router.push('/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
          <h1 className="text-3xl font-black text-white mb-2">➕ Créer un Événement</h1>
          <p className="text-gray-400 mb-8 text-sm">Réservé aux administrateurs</p>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Titre *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                required
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors placeholder-gray-500"
                placeholder="Conférence Développement Web 2026"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={3}
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors resize-none placeholder-gray-500"
                placeholder="Description de l'événement..."
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Lieu</label>
              <input
                type="text"
                value={form.location}
                onChange={e => set('location', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors placeholder-gray-500"
                placeholder="Amphithéâtre A, Université"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Date et heure *</label>
              <input
                type="datetime-local"
                value={form.event_date}
                onChange={e => set('event_date', e.target.value)}
                required
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Nombre max de participants *
              </label>
              <input
                type="number"
                value={form.max_participants}
                onChange={e => set('max_participants', parseInt(e.target.value))}
                required
                min={1}
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
              />
            </div>
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => router.push('/events')}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-gray-300 font-bold py-3 rounded-xl transition-all"
              >
                ← Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? '⏳ Création...' : "✅ Créer l'événement"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
