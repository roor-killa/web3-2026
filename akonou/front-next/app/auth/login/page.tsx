'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getAccessToken, setAccessToken } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const apiBase = useMemo(() => {
    return (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');
  }, []);

  useEffect(() => {
    if (getAccessToken()) {
      router.replace('/products');
    }
  }, [router]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data?.message || data?.errors?.email?.[0] || `Erreur API: ${response.status}`;
        throw new Error(message);
      }

      setAccessToken(data.access_token);
      router.push('/products');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la connexion';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-zinc-100 text-center">Connexion</h1>

        <form className="bg-zinc-900 rounded-lg shadow-md p-6 space-y-4" onSubmit={submitForm}>
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 text-zinc-100 px-3 py-2"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-1" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 text-zinc-100 px-3 py-2"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-70"
          >
            {saving ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <p className="text-center text-sm text-zinc-400">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Inscription
          </Link>
        </p>
      </div>
    </div>
  );
}
