"use client";

import { useEffect, useState } from "react";
import { getProduits, Produit } from "@/lib/fastapi";

export default function DashboardPrixPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [territory, setTerritory] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 20;



  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getProduits({ search, territory, page });
        setProduits(res.resultats);
        setTotal(res.total);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page, search, territory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Prix Kiprix</h1>

      {/* Filtres */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 text-sm flex-1"
        />
        <select
          value={territory}
          onChange={(e) => setTerritory(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-36"
        >
          <option value="">Tous</option>
          <option value="MQ">Martinique</option>
          <option value="GP">Guadeloupe</option>
          <option value="RE">Réunion</option>
          <option value="GF">Guyane</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          Rechercher
        </button>
      </form>

      {/* Tableau */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <span className="text-sm text-gray-500">{total} produits trouvés</span>
        </div>

        {loading ? (
          <p className="p-6 text-center text-gray-400">Chargement...</p>
        ) : produits.length === 0 ? (
          <p className="p-6 text-center text-gray-400">Aucun résultat</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Produit</th>
                <th className="text-left p-3">Territoire</th>
                <th className="text-right p-3">Prix France</th>
                <th className="text-right p-3">Prix DOM</th>
                <th className="text-right p-3">Différence</th>
              </tr>
            </thead>
            <tbody>
              {produits.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                      {p.territory_name || p.territory || "—"}
                    </span>
                  </td>
                  <td className="p-3 text-right">{p.price_france || "—"}</td>
                  <td className="p-3 text-right">{p.price_dom || "—"}</td>
                  <td className="p-3 text-right">
                    <span className={`font-medium ${p.difference && p.difference.startsWith("+")
                      ? "text-red-500"
                      : "text-green-600"
                      }`}>
                      {p.difference || "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-100"
          >
            ← Précédent
          </button>
          <span className="px-3 py-1 text-sm text-gray-500">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-100"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}
