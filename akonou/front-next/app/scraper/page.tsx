"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ScraperURL {
  id: number;
  url: string;
  territory: string;
  custom_name: string;
  active: boolean;
  last_scraped_at: string;
  next_scrape_at: string;
  status: string;
}

export default function ScraperDashboard() {
  const [urls, setUrls] = useState<ScraperURL[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("urls");

  useEffect(() => {
    fetchData();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      const [urlsRes, statsRes] = await Promise.all([
        fetch("/api/scraper/urls"),
        fetch("/api/scraper/stats"),
      ]);

      if (urlsRes.ok) {
        const data = await urlsRes.json();
        setUrls(data.data || []);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Erreur chargement données:", error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleURL(id: number) {
    try {
      const res = await fetch(`/api/scraper/urls/${id}/toggle`, {
        method: "POST",
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Erreur toggle:", error);
    }
  }

  async function launchScraping(id: number) {
    try {
      const res = await fetch("/api/scraper/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scraper_url_id: id }),
      });

      if (res.ok) {
        alert("✅ Scraping lancé !");
        fetchData();
      } else {
        alert("❌ Erreur lors du lancement");
      }
    } catch (error) {
      console.error("Erreur scraping:", error);
    }
  }

  if (loading) return <div className="p-8">⏳ Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🕷️ Dashboard Scraper Kiprix
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez vos tâches de scraping et surveillez les résultats
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistiques globales */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm text-gray-600">URLs actives</div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.active_urls}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm text-gray-600">Scrapings réussis</div>
              <div className="text-2xl font-bold text-green-600">
                {stats.successful_scrapings}
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-sm text-gray-600">Scrapings échoués</div>
              <div className="text-2xl font-bold text-red-600">
                {stats.failed_scrapings}
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-sm text-gray-600">Produits total</div>
              <div className="text-2xl font-bold text-purple-600">
                {stats.total_products}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b">
          <button
            onClick={() => setActiveTab("urls")}
            className={`px-4 py-2 font-medium ${
              activeTab === "urls"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            URLs à scraper
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-4 py-2 font-medium ${
              activeTab === "add"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            + Ajouter une URL
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2 font-medium ${
              activeTab === "logs"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            📋 Logs
          </button>
        </div>

        {/* Contenu des tabs */}
        {activeTab === "urls" && (
          <div className="bg-white rounded-lg shadow">
            {urls.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Aucune URL configurée. Ajouter une URL pour commencer.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Territoire
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Dernier scraping
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {urls.map((url) => (
                      <tr key={url.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {url.custom_name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {url.territory.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              url.active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {url.active ? "✅ Actif" : "⛔ Inactif"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {url.last_scraped_at
                            ? new Date(url.last_scraped_at).toLocaleDateString(
                                "fr-FR"
                              )
                            : "Jamais"}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => launchScraping(url.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                          >
                            🚀 Lancer
                          </button>
                          <button
                            onClick={() => toggleURL(url.id)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                          >
                            {url.active ? "Désactiver" : "Activer"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "add" && <AddURLForm onAdded={fetchData} />}

        {activeTab === "logs" && <ScrapingLogs />}
      </div>
    </div>
  );
}

// Composant pour ajouter une URL
function AddURLForm({ onAdded }: { onAdded: () => void }) {
  const [formData, setFormData] = useState({
    url: "",
    territory: "gp",
    custom_name: "",
    max_pages: 10,
    cron_expression: "0 2 * * *",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/scraper/urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ URL ajoutée avec succès !");
        setFormData({
          url: "",
          territory: "gp",
          custom_name: "",
          max_pages: 10,
          cron_expression: "0 2 * * *",
        });
        onAdded();
      } else {
        const error = await res.json();
        alert("❌ Erreur: " + error.message);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">Ajouter une URL à scraper</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            id="url"
            type="url"
            placeholder="https://kiprix.com"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label htmlFor="territory" className="block text-sm font-medium text-gray-700 mb-1">
            Territoire
          </label>
          <select
            id="territory"
            value={formData.territory}
            onChange={(e) =>
              setFormData({ ...formData, territory: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            aria-label="Sélectionnez un territoire"
          >
            <option value="gp">Guadeloupe</option>
            <option value="mq">Martinique</option>
            <option value="re">La Réunion</option>
            <option value="gf">Guyane</option>
          </select>
        </div>

        <div>
          <label htmlFor="custom_name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom (optionnel)
          </label>
          <input
            id="custom_name"
            type="text"
            placeholder="Mon scraper Kiprix"
            value={formData.custom_name}
            onChange={(e) =>
              setFormData({ ...formData, custom_name: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            aria-label="Nom personnalisé du scraper"
          />
        </div>

        <div>
          <label htmlFor="max_pages" className="block text-sm font-medium text-gray-700 mb-1">
            Max pages
          </label>
          <input
            id="max_pages"
            type="number"
            min="1"
            max="100"
            value={formData.max_pages}
            onChange={(e) =>
              setFormData({ ...formData, max_pages: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            aria-label="Maximum de pages à scraper"
          />
        </div>

        <div>
          <label htmlFor="cron_expression" className="block text-sm font-medium text-gray-700 mb-1">
            Cron (ex: 0 2 * * * = 2h du matin)
          </label>
          <input
            id="cron_expression"
            type="text"
            placeholder="0 2 * * *"
            value={formData.cron_expression}
            onChange={(e) =>
              setFormData({ ...formData, cron_expression: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            aria-label="Expression Cron pour la planification"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          ➕ Ajouter URL
        </button>
      </form>
    </div>
  );
}

// Composant pour les logs
function ScrapingLogs() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  async function fetchLogs() {
    try {
      const res = await fetch("/api/scraper/logs?lines=50");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error("Erreur logs:", error);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">📋 Logs du Scraper</h2>

      <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-gray-500">Aucun log disponible</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="mb-1">
              {log}
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => fetchLogs()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        🔄 Rafraîchir
      </button>
    </div>
  );
}
