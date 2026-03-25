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
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{
          fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em",
          background: "linear-gradient(90deg, #e2e8f0, #a78bfa)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          💰 Prix Kiprix
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
          Comparateur de prix France / DOM
        </p>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <input
          type="text" placeholder="Rechercher un produit..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1, padding: "0.6rem 1rem", borderRadius: "0.75rem",
            background: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.2)",
            color: "#e2e8f0", fontSize: "0.875rem", outline: "none",
          }}
        />
        <select value={territory} onChange={(e) => { setTerritory(e.target.value); setPage(1); }}
          style={{
            padding: "0.6rem 1rem", borderRadius: "0.75rem", width: "160px",
            background: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.2)",
            color: "#e2e8f0", fontSize: "0.875rem", outline: "none",
          }}
        >
          <option value="">Tous</option>
          <option value="mq">🇲🇶 Martinique</option>
          <option value="gp">🇬🇵 Guadeloupe</option>
          <option value="re">🇷🇪 Réunion</option>
          <option value="gf">🇬🇫 Guyane</option>
        </select>
        <button type="submit" style={{
          padding: "0.6rem 1.25rem", borderRadius: "0.75rem",
          background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
          color: "white", border: "none", fontWeight: 600, fontSize: "0.875rem",
          cursor: "pointer", boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
        }}>
          Rechercher
        </button>
      </form>

      {/* Table */}
      <div style={{
        background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "1rem", overflow: "hidden",
        backdropFilter: "blur(10px)", boxShadow: "0 20px 40px rgba(2,9,27,0.35)",
      }}>
        <div style={{
          padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ color: "#64748b", fontSize: "0.82rem" }}>
            {total} produit{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
          </span>
          {loading && <span style={{ color: "#7c3aed", fontSize: "0.82rem" }}>⏳ Chargement...</span>}
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Produit", "Territoire", "Prix France", "Prix DOM", "Différence"].map((h) => (
                <th key={h} style={{
                  padding: "0.75rem 1rem", textAlign: h === "Produit" || h === "Territoire" ? "left" : "right",
                  fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em",
                  textTransform: "uppercase", color: "#475569",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {produits.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#475569" }}>
                  Aucun produit trouvé
                </td>
              </tr>
            ) : produits.map((p) => (
              <tr key={p.id} style={{
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                transition: "background 0.15s ease",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "0.75rem 1rem", color: "#cbd5e1", fontWeight: 500, maxWidth: "280px" }}>
                  <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.name}
                  </span>
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span style={{
                    background: "rgba(99,102,241,0.15)", color: "#a5b4fc",
                    padding: "0.2rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600,
                  }}>
                    {p.territory_name || p.territory || "—"}
                  </span>
                </td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right", color: "#94a3b8" }}>{p.price_france || "—"}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right", color: "#e2e8f0", fontWeight: 600 }}>{p.price_dom || "—"}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                  <span style={{
                    fontWeight: 700,
                    color: p.difference && p.difference.startsWith("+") ? "#f87171" : "#34d399",
                  }}>
                    {p.difference || "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            style={{
              padding: "0.5rem 1rem", borderRadius: "0.65rem", fontSize: "0.82rem",
              background: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.2)",
              color: page === 1 ? "#334155" : "#94a3b8", cursor: page === 1 ? "not-allowed" : "pointer",
            }}>← Précédent</button>
          <span style={{
            padding: "0.5rem 1rem", borderRadius: "0.65rem",
            background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
            color: "#a5b4fc", fontSize: "0.82rem", fontWeight: 600,
          }}>{page} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{
              padding: "0.5rem 1rem", borderRadius: "0.65rem", fontSize: "0.82rem",
              background: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.2)",
              color: page === totalPages ? "#334155" : "#94a3b8", cursor: page === totalPages ? "not-allowed" : "pointer",
            }}>Suivant →</button>
        </div>
      )}
    </div>
  );
}
