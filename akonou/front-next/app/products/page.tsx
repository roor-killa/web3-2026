'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number | null;
  sku: string | null;
  created_at: string;
  updated_at: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', quantity: '', sku: '' });
    setEditingId(null);
  };

  const mapApiError = (message: string) => {
    if (message.includes('422')) {
      return 'Validation error. Check required fields.';
    }
    return message;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiBase}/products`);
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data.data || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors du chargement des produits';
        setError(mapApiError(message));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiBase]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price ?? ''),
      quantity: product.quantity === null ? '' : String(product.quantity),
      sku: product.sku || '',
    });
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingId) {
      setError('Selectionnez un produit a modifier.');
      return;
    }
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
      const url = `${apiBase}/products/${editingId}`;
      const method = 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      setProducts((prev) => prev.map((item) => (item.id === editingId ? data.data : item)));
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setError(mapApiError(message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Supprimer ce produit ?')) {
      return;
    }

    try {
      const response = await fetch(`${apiBase}/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      setProducts((prev) => prev.filter((item) => item.id !== productId));
      if (editingId === productId) {
        resetForm();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(mapApiError(message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-red-600 text-xl">
          <p>Erreur: {error}</p>
          <p className="text-sm mt-2">Assurez-vous que le serveur Laravel est en cours d'exécution sur http://localhost:8000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl font-bold text-gray-900">Produits</h1>
          <Link
            href="/products/new"
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Ajouter un produit
          </Link>
        </div>

        {editingId && (
          <form
            className="bg-white rounded-lg shadow-md p-6 grid gap-4 md:grid-cols-2"
            onSubmit={submitForm}
          >
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold text-gray-900">
                Modifier un produit
              </h2>
            </div>

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
                {saving ? 'Sauvegarde...' : 'Mettre a jour'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {products.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">Aucun produit disponible</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col gap-4"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h2>

                  {product.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {product.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    {product.sku && (
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">SKU:</span> {product.sku}
                      </p>
                    )}
                    {product.quantity !== null && (
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Quantite:</span> {product.quantity}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4 flex items-center justify-between gap-3">
                  <p className="text-3xl font-bold text-blue-600">
                    {parseFloat(String(product.price)).toFixed(2)} €
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 rounded-md border border-gray-300 text-gray-700"
                    >
                      Editer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1 rounded-md border border-red-200 text-red-600"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
