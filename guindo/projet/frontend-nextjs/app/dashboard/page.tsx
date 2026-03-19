"use client";

import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getScrapeUrls,
  addScrapeUrl,
  deleteScrapeUrl,
  toggleScrapeUrl,
  DashboardStats,
  ScrapeUrl,
  getFastapiToken,
} from "@/lib/fastapi";
import { useRouter } from "next/navigation";
// import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [urls, setUrls] = useState<ScrapeUrl[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getFastapiToken()) {
      router.push("/login");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [s, u] = await Promise.all([getDashboardStats(), getScrapeUrls()]);
      setStats(s);
      setUrls(u);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newUrl) return;
    setAdding(true);
    try {
      await addScrapeUrl(newUrl, newLabel || undefined);
      setNewUrl("");
      setNewLabel("");
      fetchData();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteScrapeUrl(id);
    fetchData();
  };

  const handleToggle = async (id: number, actif: boolean) => {
    await toggleScrapeUrl(id, !actif);
    fetchData();
  };

  const statCards = stats ? [
    {
      label: 'URLs Enregistrées',
      value: stats.total_urls,
      icon: '🔗',
      gradient: 'from-primary-500 to-primary-600',
      bg: 'bg-primary-50',
      text: 'text-primary-700',
      border: 'border-primary-100',
    },
    {
      label: 'URLs Actives',
      value: stats.urls_actives,
      icon: '✅',
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
    },
    {
      label: 'Données Récupérées',
      value: stats.total_donnees,
      icon: '📦',
      gradient: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      border: 'border-violet-100',
    },
  ] : [];

  if (loading) {
    return (
      <>
        {/* <Navbar /> */}
        <div className="page-light section">
          <div className="container-app">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => <div key={i} className="card p-6"><div className="skeleton h-20 rounded-xl" /></div>)}
            </div>
            <div className="card p-8"><div className="skeleton h-40 rounded-xl" /></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* <Navbar /> */}
      <div className="page-light">
        <div className="section">
          <div className="container-app">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
              <h1 className="page-title flex items-center gap-3">
                <span className="text-4xl">📊</span>
                Dashboard Scraping
              </h1>
              <p className="page-subtitle">Gérez vos URLs et visualisez les statistiques</p>
            </div>

            {/* Error */}
            {error && (
              <div className="alert-error mb-6 animate-fade-in">
                <span>⚠️</span>
                <div>
                  <p className="font-bold">Erreur</p>
                  <p className="text-sm mt-0.5">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
              </div>
            )}

            {/* Stat Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 stagger-children">
                {statCards.map(({ label, value, icon, gradient, bg, text, border }) => (
                  <div key={label} className={`card stat-card border ${border} animate-fade-in`}>
                    <div className={`stat-icon bg-gradient-to-br ${gradient} shadow-md`}>
                      <span>{icon}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
                      <p className={`text-4xl font-extrabold ${text} mt-1`}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add URL Form */}
            <div className="form-card mb-6">
              <h2 className="form-section-title">
                <span>➕</span> Ajouter un site à scraper
              </h2>
              <p className="text-slate-500 text-sm mb-5">Entrez l'URL du site et un label optionnel</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🌐</span>
                  <input
                    type="url"
                    placeholder="https://exemple.com"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    className="input-field pl-9"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Label (optionnel)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="input-field sm:w-44"
                />
                <button
                  onClick={handleAdd}
                  disabled={adding || !newUrl}
                  className="btn-primary shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {adding ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Ajout...
                    </>
                  ) : '➕ Ajouter'}
                </button>
              </div>
            </div>

            {/* URLs Table */}
            <div className="card overflow-hidden animate-fade-in">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="form-section-title">
                  <span>📋</span> URLs scannées
                  <span className="badge-neutral ml-2 text-sm">{urls.length}</span>
                </h2>
                <button onClick={fetchData} className="btn-ghost btn-sm" title="Rafraîchir">
                  🔄
                </button>
              </div>

              {urls.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="text-5xl mb-3">🚫</div>
                  <p className="text-lg font-semibold text-slate-600">Aucune URL enregistrée</p>
                  <p className="text-slate-400 text-sm mt-1">Commencez par ajouter une URL ci-dessus</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="table-header">URL</th>
                        <th className="table-header hidden sm:table-cell">Label</th>
                        <th className="table-header w-24">Données</th>
                        <th className="table-header w-32">Statut</th>
                        <th className="table-header w-44">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {urls.map((u) => (
                        <tr key={u.id} className="table-row">
                          <td className="table-cell">
                            <a
                              href={u.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-800 hover:underline font-medium truncate block max-w-xs"
                              title={u.url}
                            >
                              {u.url}
                            </a>
                          </td>
                          <td className="table-cell hidden sm:table-cell">
                            {u.label ? (
                              <span className="badge-info">{u.label}</span>
                            ) : (
                              <span className="text-slate-300 font-medium">—</span>
                            )}
                          </td>
                          <td className="table-cell">
                            <span className="font-bold text-slate-800">{u.nb_donnees}</span>
                          </td>
                          <td className="table-cell">
                            {u.actif ? (
                              <span className="badge-success">● Actif</span>
                            ) : (
                              <span className="badge-neutral">⏸ Inactif</span>
                            )}
                          </td>
                          <td className="table-cell">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleToggle(u.id, u.actif)}
                                className={`btn btn-sm text-xs ${u.actif ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                              >
                                {u.actif ? '⏸ Désact.' : '▶ Activer'}
                              </button>
                              <button
                                onClick={() => handleDelete(u.id)}
                                className="btn btn-sm bg-red-100 text-red-600 hover:bg-red-200 text-xs"
                              >
                                🗑️
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
          </div>
        </div>
      </div>
    </>
  );
}
