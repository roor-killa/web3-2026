"use client";

import { useEffect, useState } from "react";
import { getDashboardStats, getScrapeUrls, addScrapeUrl, deleteScrapeUrl, toggleScrapeUrl, DashboardStats, ScrapeUrl, getFastapiToken } from "@/lib/fastapi";
import { useRouter } from "next/navigation";

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
    if (!getFastapiToken()) { router.push("/dashboard/login"); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [s, u] = await Promise.all([getDashboardStats(), getScrapeUrls()]);
      setStats(s); setUrls(u);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!newUrl) return;
    setAdding(true);
    try {
      await addScrapeUrl(newUrl, newLabel || undefined);
      setNewUrl(""); setNewLabel("");
      fetchData();
    } catch (e: any) { setError(e.message); }
    finally { setAdding(false); }
  };

  const statCards = stats ? [
    { label: "URLs enregistrées", value: stats.total_urls, icon: "🔗", color: "#6366f1", glow: "rgba(99,102,241,0.3)" },
    { label: "URLs actives", value: stats.urls_actives, icon: "✅", color: "#10b981", glow: "rgba(16,185,129,0.3)" },
    { label: "Données récupérées", value: stats.total_donnees, icon: "📦", color: "#8b5cf6", glow: "rgba(139,92,246,0.3)" },
  ] : [];

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center", color: "#64748b" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏳</div>
        <p style={{ fontSize: "0.875rem" }}>Chargement...</p>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{
          fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em",
          background: "linear-gradient(90deg, #e2e8f0, #a78bfa)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>📊 Dashboard Scraping</h1>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
          Gérez vos URLs et visualisez les statistiques
        </p>
      </div>

      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
          color: "#fca5a5", padding: "0.75rem 1rem", borderRadius: "0.75rem",
          fontSize: "0.85rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between",
        }}>
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}>✕</button>
        </div>
      )}

      {/* Stat Cards */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {statCards.map(({ label, value, icon, color, glow }) => (
            <div key={label} style={{
              background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "1rem", padding: "1.5rem",
              backdropFilter: "blur(10px)", boxShadow: "0 20px 40px rgba(2,9,27,0.3)",
            }}>
              <div style={{
                width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem",
                background: `${color}22`, border: `1px solid ${color}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.25rem", marginBottom: "1rem",
                boxShadow: `0 6px 20px ${glow}`,
              }}>{icon}</div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#475569", marginBottom: "0.35rem" }}>{label}</p>
              <p style={{ fontSize: "2.25rem", fontWeight: 800, color, letterSpacing: "-0.04em" }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add URL */}
      <div style={{
        background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "1rem", padding: "1.5rem", marginBottom: "1.5rem",
        backdropFilter: "blur(10px)",
      }}>
        <h2 style={{ fontWeight: 700, color: "#f1f5f9", marginBottom: "0.25rem", fontSize: "0.95rem" }}>➕ Ajouter un site à scraper</h2>
        <p style={{ color: "#475569", fontSize: "0.8rem", marginBottom: "1rem" }}>Entrez l'URL du site et un label optionnel</p>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <input type="url" placeholder="https://www.kiprix.com/fr-mq" value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            style={{
              flex: 1, padding: "0.6rem 1rem", borderRadius: "0.75rem",
              background: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.2)",
              color: "#e2e8f0", fontSize: "0.875rem", outline: "none",
            }}
          />
          <input type="text" placeholder="Label (optionnel)" value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            style={{
              width: "160px", padding: "0.6rem 1rem", borderRadius: "0.75rem",
              background: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.2)",
              color: "#e2e8f0", fontSize: "0.875rem", outline: "none",
            }}
          />
          <button onClick={handleAdd} disabled={adding || !newUrl} style={{
            padding: "0.6rem 1.25rem", borderRadius: "0.75rem",
            background: adding || !newUrl ? "rgba(99,102,241,0.3)" : "linear-gradient(90deg, #6366f1, #8b5cf6)",
            color: "white", border: "none", fontWeight: 600, fontSize: "0.875rem",
            cursor: adding || !newUrl ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(99,102,241,0.3)", whiteSpace: "nowrap",
          }}>
            {adding ? "⏳..." : "➕ Ajouter"}
          </button>
        </div>
      </div>

      {/* URLs Table */}
      <div style={{
        background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "1rem", overflow: "hidden", backdropFilter: "blur(10px)",
      }}>
        <div style={{
          padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <h2 style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.95rem" }}>
            📋 URLs scannées
            <span style={{
              marginLeft: "0.5rem", background: "rgba(148,163,184,0.15)",
              color: "#94a3b8", padding: "0.15rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem",
            }}>{urls.length}</span>
          </h2>
          <button onClick={fetchData} style={{
            background: "transparent", border: "1px solid rgba(148,163,184,0.2)",
            color: "#94a3b8", borderRadius: "0.6rem", padding: "0.3rem 0.7rem",
            fontSize: "0.75rem", cursor: "pointer",
          }}>🔄 Rafraîchir</button>
        </div>

        {urls.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "#334155" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🚫</div>
            <p style={{ fontWeight: 600, color: "#475569" }}>Aucune URL enregistrée</p>
            <p style={{ fontSize: "0.8rem", color: "#334155", marginTop: "0.35rem" }}>Ajoutez une URL ci-dessus</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {["URL", "Label", "Données", "Statut", "Actions"].map((h) => (
                  <th key={h} style={{
                    padding: "0.75rem 1rem", textAlign: "left",
                    fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em",
                    textTransform: "uppercase", color: "#475569",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {urls.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "0.75rem 1rem", maxWidth: "260px" }}>
                    <a href={u.url} target="_blank" rel="noopener noreferrer"
                      style={{ color: "#a5b4fc", textDecoration: "none", fontSize: "0.82rem",
                               overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                      {u.url}
                    </a>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    {u.label ? (
                      <span style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd", padding: "0.2rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem" }}>{u.label}</span>
                    ) : <span style={{ color: "#334155" }}>—</span>}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "#e2e8f0" }}>{u.nb_donnees}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{
                      background: u.actif ? "rgba(16,185,129,0.15)" : "rgba(100,116,139,0.2)",
                      color: u.actif ? "#6ee7b7" : "#94a3b8",
                      padding: "0.2rem 0.65rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600,
                    }}>
                      {u.actif ? "● Actif" : "⏸ Inactif"}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => toggleScrapeUrl(u.id, !u.actif).then(fetchData)}
                        style={{
                          padding: "0.25rem 0.65rem", borderRadius: "0.5rem", fontSize: "0.72rem", fontWeight: 600,
                          background: u.actif ? "rgba(100,116,139,0.2)" : "rgba(16,185,129,0.15)",
                          color: u.actif ? "#94a3b8" : "#6ee7b7", border: "none", cursor: "pointer",
                        }}>
                        {u.actif ? "Désact." : "Activer"}
                      </button>
                      <button onClick={() => deleteScrapeUrl(u.id).then(fetchData)}
                        style={{
                          padding: "0.25rem 0.65rem", borderRadius: "0.5rem", fontSize: "0.72rem",
                          background: "rgba(239,68,68,0.15)", color: "#f87171", border: "none", cursor: "pointer",
                        }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
