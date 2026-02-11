'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    sku: '',
  });

  const apiBase = useMemo(() => {
    return (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');
  }, []);

  const mapApiError = (message: string) => {
    if (message.includes('422')) {
      return 'Validation error. Check required fields.';
    }
    return message;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: form.price === '' ? null : Number(form.price),
      quantity: form.quantity === '' ? null : Number(form.quantity),
      sku: form.sku.trim() || null,
    };

    try {
      const response = await fetch(`${apiBase}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      await response.json();
      router.push('/products');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la creation';
      setError(mapApiError(message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Ajouter un produit</h1>
          <Link
            href="/products"
            className="px-3 py-2 rounded-md border border-gray-300 text-gray-700"
          >
            Retour
          </Link>
        </div>

        <form
          className="bg-white rounded-lg shadow-md p-6 grid gap-4 md:grid-cols-2"
          onSubmit={submitForm}
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="name">
              Nom
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Nom du produit"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="price">
              Prix
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="sku">
              SKU
            </label>
            <input
              id="sku"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="SKU-001"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="quantity">
              Quantite
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="0"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Description du produit"
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-70"
            >
              {saving ? 'Creation...' : 'Creer'}
            </button>
            <Link
              href="/products"
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700"
            >
              Annuler
            </Link>
          </div>
        </form>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
