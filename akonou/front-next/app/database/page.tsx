'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { clearAccessToken, getAccessToken } from '@/lib/auth';

interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  quantity: number | null;
  sku?: string | null;
}

interface EventItem {
  id: number;
  title?: string;
  name?: string;
  date?: string;
}

interface ScraperStats {
  active_urls?: number;
  successful_scrapings?: number;
  failed_scrapings?: number;
  total_products?: number;
}

interface ApiPayload<T> {
  data?: T;
}

export default function DatabasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [myEvents, setMyEvents] = useState<EventItem[]>([]);
  const [scraperStats, setScraperStats] = useState<ScraperStats | null>(null);

  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    sku: '',
  });

  const apiBase = useMemo(() => {
    return (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');
  }, []);

  const authHeaders = useCallback(() => {
    const token = getAccessToken();
    return {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const handleUnauthorized = useCallback(() => {
    clearAccessToken();
    router.replace('/login');
  }, [router]);

  const fetchDataset = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [productsRes, eventsRes, myEventsRes, scraperStatsRes] = await Promise.all([
        fetch(`${apiBase}/products`, { headers: authHeaders() }),
        fetch(`${apiBase}/events`, { headers: authHeaders() }),
        fetch(`${apiBase}/my-events`, { headers: authHeaders() }),
        fetch(`${apiBase}/scraper/stats`, { headers: authHeaders() }),
      ]);

      const responses = [productsRes, eventsRes, myEventsRes, scraperStatsRes];
      if (responses.some((response) => response.status === 401)) {
        handleUnauthorized();
        return;
      }

      if (productsRes.ok) {
        const payload = (await productsRes.json()) as ApiPayload<Product[]>;
        setProducts(payload.data ?? []);
      }

      if (eventsRes.ok) {
        const payload = (await eventsRes.json()) as ApiPayload<EventItem[]>;
        setEvents(payload.data ?? []);
      }

      if (myEventsRes.ok) {
        const payload = (await myEventsRes.json()) as ApiPayload<EventItem[]>;
        setMyEvents(payload.data ?? []);
      }

      if (scraperStatsRes.ok) {
        const payload = (await scraperStatsRes.json()) as ScraperStats;
        setScraperStats(payload);
      } else if (scraperStatsRes.status === 403) {
        setScraperStats(null);
      }
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Erreur réseau';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [apiBase, authHeaders, handleUnauthorized, router]);

  const resetProductForm = useCallback(() => {
    setEditingId(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      quantity: '',
      sku: '',
    });
  }, []);

  const startEditProduct = useCallback((product: Product) => {
    setEditingId(product.id);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price ?? ''),
      quantity: product.quantity === null ? '' : String(product.quantity),
      sku: product.sku || '',
    });
  }, []);

  const submitProduct = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    const token = getAccessToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      name: productForm.name.trim(),
      description: productForm.description.trim() || null,
      price: Number(productForm.price),
      quantity: productForm.quantity === '' ? null : Number(productForm.quantity),
      sku: productForm.sku.trim() || null,
    };

    try {
      const url = editingId ? `${apiBase}/products/${editingId}` : `${apiBase}/products`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = (await response.json()) as ApiPayload<Product>;
      const savedProduct = data.data;

      if (savedProduct) {
        if (editingId) {
          setProducts((prev) => prev.map((item) => (item.id === editingId ? savedProduct : item)));
        } else {
          setProducts((prev) => [savedProduct, ...prev]);
        }
      }

      resetProductForm();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Erreur lors de la sauvegarde';
      setError(message);
    } finally {
      setSaving(false);
    }
  }, [apiBase, authHeaders, editingId, handleUnauthorized, productForm, resetProductForm, router]);

  const deleteProduct = useCallback(async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) {
      return;
    }

    try {
      const response = await fetch(`${apiBase}/products/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      setProducts((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) {
        resetProductForm();
      }
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : 'Erreur lors de la suppression';
      setError(message);
    }
  }, [apiBase, authHeaders, editingId, handleUnauthorized, resetProductForm]);

  useEffect(() => {
    fetchDataset();
  }, [fetchDataset]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <p className="text-zinc-300 text-xl">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold text-zinc-100">Interfaces Base de Données</h1>
            <p className="text-zinc-400 mt-2">Vue centralisée des données Laravel/PostgreSQL.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchDataset}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Rafraîchir
            </button>
            <Link
              href="/products"
              className="px-4 py-2 rounded-md border border-zinc-700 text-zinc-200"
            >
              Produits
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-700 bg-red-900/30 text-red-300 px-4 py-3">
            Erreur: {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Produits" value={products.length} />
          <StatCard label="Événements" value={events.length} />
          <StatCard label="Mes événements" value={myEvents.length} />
          <StatCard label="URLs scraper actives" value={scraperStats?.active_urls ?? 0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-zinc-100 text-lg font-semibold">Produits (CRUD)</h2>
              {editingId && (
                <button
                  type="button"
                  onClick={resetProductForm}
                  className="text-sm px-3 py-1 rounded border border-zinc-700 text-zinc-300"
                >
                  Annuler édition
                </button>
              )}
            </div>

            <form onSubmit={submitProduct} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-b border-zinc-800">
              <input
                type="text"
                placeholder="Nom"
                value={productForm.name}
                onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
                className="px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-zinc-100"
                required
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Prix"
                value={productForm.price}
                onChange={(event) => setProductForm((prev) => ({ ...prev, price: event.target.value }))}
                className="px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-zinc-100"
                required
              />
              <input
                type="number"
                min="0"
                placeholder="Quantité"
                value={productForm.quantity}
                onChange={(event) => setProductForm((prev) => ({ ...prev, quantity: event.target.value }))}
                className="px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-zinc-100"
              />
              <input
                type="text"
                placeholder="SKU"
                value={productForm.sku}
                onChange={(event) => setProductForm((prev) => ({ ...prev, sku: event.target.value }))}
                className="px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-zinc-100"
              />
              <textarea
                placeholder="Description"
                value={productForm.description}
                onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
                className="md:col-span-2 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-zinc-100"
                rows={2}
              />
              <button
                type="submit"
                disabled={saving}
                className="md:col-span-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? 'Sauvegarde...' : editingId ? 'Mettre à jour le produit' : 'Créer le produit'}
              </button>
            </form>

            {products.length === 0 ? (
              <div className="px-4 py-6 text-zinc-400">Aucun produit</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-zinc-800/70 text-zinc-300">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium">ID</th>
                      <th className="text-left px-4 py-2 font-medium">Nom</th>
                      <th className="text-left px-4 py-2 font-medium">Prix</th>
                      <th className="text-left px-4 py-2 font-medium">Quantité</th>
                      <th className="text-left px-4 py-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 text-zinc-200">
                    {products.slice(0, 20).map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-2">{product.id}</td>
                        <td className="px-4 py-2">{product.name}</td>
                        <td className="px-4 py-2">{product.price}</td>
                        <td className="px-4 py-2">{product.quantity ?? '-'}</td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => startEditProduct(product)}
                              className="px-2 py-1 rounded border border-zinc-700 text-zinc-200"
                            >
                              Éditer
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteProduct(product.id)}
                              className="px-2 py-1 rounded border border-red-700 text-red-300"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <DataTable
            title="Événements"
            columns={['ID', 'Titre', 'Date']}
            rows={events.slice(0, 10).map((eventItem) => [
              String(eventItem.id),
              eventItem.title || eventItem.name || 'Sans titre',
              eventItem.date || '-',
            ])}
            emptyLabel="Aucun événement"
          />

          <DataTable
            title="Mes événements"
            columns={['ID', 'Titre', 'Date']}
            rows={myEvents.slice(0, 10).map((eventItem) => [
              String(eventItem.id),
              eventItem.title || eventItem.name || 'Sans titre',
              eventItem.date || '-',
            ])}
            emptyLabel="Aucun événement inscrit"
          />

          <DataTable
            title="Scraper - Stats"
            columns={['Métrique', 'Valeur']}
            rows={[
              ['URLs actives', String(scraperStats?.active_urls ?? 0)],
              ['Scrapings réussis', String(scraperStats?.successful_scrapings ?? 0)],
              ['Scrapings échoués', String(scraperStats?.failed_scrapings ?? 0)],
              ['Produits scrapés', String(scraperStats?.total_products ?? 0)],
            ]}
            emptyLabel="Stats indisponibles"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4">
      <p className="text-zinc-400 text-sm">{label}</p>
      <p className="text-zinc-100 text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function DataTable({
  title,
  columns,
  rows,
  emptyLabel,
}: {
  title: string;
  columns: string[];
  rows: string[][];
  emptyLabel: string;
}) {
  return (
    <div className="rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800">
        <h2 className="text-zinc-100 text-lg font-semibold">{title}</h2>
      </div>
      {rows.length === 0 ? (
        <div className="px-4 py-6 text-zinc-400">{emptyLabel}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-800/70 text-zinc-300">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="text-left px-4 py-2 font-medium">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-200">
              {rows.map((row, rowIndex) => (
                <tr key={`${title}-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${title}-${rowIndex}-${cellIndex}`} className="px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}