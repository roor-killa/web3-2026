"use client";

import { useEffect, useState } from "react";
import { getFastapiToken } from "@/lib/fastapi";

const FASTAPI = "http://localhost:8000/api/v1";

interface ScrapeLog {
  id: number;
  territory: string;
  pages: number;
  status: "running" | "success" | "error";
  nb_produits: number;
  message: string | null;
  started_at: string | null;
  finished_at: string | null;
}

const TERRITORIES = [
  { value: "mq", label: "🇲🇶 Martinique" },
  { value: "gp", label: "🇬🇵 Guadeloupe" },
  { value: "re", label: "🇷🇪 Réunion" },
  { value: "gf", label: "🇬🇫 Guyane" },
];

export default function DashboardScrapePage() {
  const [logs, setLogs] = useState<ScrapeLog[]>([]);
  const [territory, setTerritory] = useState("mq");
  const [pages, setPages] = useState(1);
  const [running, setRunning] = useState(false);
  const [currentLogId, setCurrentLogId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getFastapiToken()}`,
  };

  const fetchLogs = async () => {
    const res = await fetch(`${FASTAPI}/admin/scrape/logs`, { headers });
    if (res.ok) setLogs(await res.json());
  };

  useEffect(() => { fetchLogs(); }, []);

  useEffect(() => {
    if (!running || !currentLogId) return;
    const interval = setInterval(async () => {
      const res = await fetch(`${FASTAPI}/admin/scrape/logs/${currentLogId}`, { headers });
      if (res.ok) {
        const log: ScrapeLog = await res.json();
        setLogs((prev) => prev.map((l) => (l.id === log.id ? log : l)));
        if (log.status !== "running") {
          setRunning(false);
          setCurrentLogId(null);
          clearInterval(interval);
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [running, currentLogId]);

  const handleRun = async () => {
    setError(null);
    setRunning(true);
    try {
      const res = await fetch(`${FASTAPI}/admin/scrape/run`, {
        method: "POST", headers,
        body: JSON.stringify({ territory, pages }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Erreur");
      }
      const log: ScrapeLog = await res.json();
      setLogs((prev) => [log, ...prev]);
      setCurrentLogId(log.id);
    } catch (e: any) {
      setError(e.message);
      setRunning(false);
    }
  };

  const statusConfig = {
    running: { color: "#fbbf24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.25)", label: "⏳ En cours" },
    success: { color: "#34d399", bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.25)", label: "✅ Succès" },
    error: { color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.25)", label: "❌ Erreur" },
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{
          fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em",
          background: "linear-gradient(90deg, #e2e8f0, #a78bfa)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>🕷️ Lancer un Scraping</h1>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
          Déclenchez un scraping Kiprix et suivez son avancement en temps réel
        </p>
      </div>

      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
          color: "#fca5a5", padding: "0.75rem 1rem", borderRadius: "0.75rem",
          fontSize: "0.85rem", marginBottom: "1.5rem",
        }}>⚠️ {error}</div>
      )}

      {/* Launch card */}
      <div style={{
        background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "1rem", padding: "1.75rem", marginBottom: "1.5rem",
        backdropFilter: "blur(10px)", boxShadow: "0 20px 40px rgba(2,9,27,0.35)",
      }}>
        <h2 style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.95rem", marginBottom: "1.25rem" }}>
          Nouveau scraping Kiprix
        </h2>

        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#475569", marginBottom: "0.4rem" }}>
              Territoire
            </label>
            <select value={territory} onChange={(e) => setTerritory(e.target.value)}
              style={{
                padding: "0.6rem 1rem", borderRadius: "0.75rem", width: "180px",
                background: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.2)",
                color: "#e2e8f0", fontSize: "0.875rem", outline: "none",
              }}>
              {TERRITORIES.map((t) => (
                <option key={t.value} value={t.value} style={{ background: "#0f172a" }}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#475569", marginBottom: "0.4rem" }}>
              Pages
            </label>
            <input type="number" min={1} max={20} value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              style={{
                width: "80px", padding: "0.6rem 1rem", borderRadius: "0.75rem",
                background: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.2)",
                color: "#e2e8f0", fontSize: "0.875rem", outline: "none",
              }}
            />
          </div>

          <button onClick={handleRun} disabled={running} style={{
            padding: "0.65rem 1.5rem", borderRadius: "0.75rem",
            background: running ? "rgba(99,102,241,0.3)" : "linear-gradient(90deg, #6366f1, #8b5cf6)",
            color: "white", border: "none", fontWeight: 700, fontSize: "0.875rem",
            cursor: running ? "not-allowed" : "pointer",
            boxShadow: running ? "none" : "0 6px 20px rgba(99,102,241,0.35)",
          }}>
            {running ? "⏳ En cours..." : "▶ Lancer"}
          </button>
        </div>

        {running && (
          <div style={{
            marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: "0.75rem",
            background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)",
            color: "#fcd34d", fontSize: "0.82rem",
          }}>
            ⏳ Scraping en arrière-plan — cette page se met à jour automatiquement toutes les 3 secondes...
          </div>
        )}
      </div>

      {/* Logs table */}
      <div style={{
        background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "1rem", overflow: "hidden", backdropFilter: "blur(10px)",
      }}>
        <div style={{
          padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <h2 style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.95rem" }}>
            📋 Historique des scraping
          </h2>
          <button onClick={fetchLogs} style={{
            background: "transparent", border: "1px solid rgba(148,163,184,0.2)",
            color: "#94a3b8", borderRadius: "0.6rem", padding: "0.3rem 0.7rem",
            fontSize: "0.75rem", cursor: "pointer",
          }}>🔄 Rafraîchir</button>
        </div>

        {logs.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🕸️</div>
            <p style={{ color: "#475569", fontWeight: 600 }}>Aucun scraping lancé</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {["Territoire", "Pages", "Statut", "Produits", "Lancé le", "Message"].map((h) => (
                  <th key={h} style={{
                    padding: "0.75rem 1rem", textAlign: "left",
                    fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em",
                    textTransform: "uppercase", color: "#475569",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const sc = statusConfig[log.status] || statusConfig.error;
                return (
                  <tr key={log.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span style={{
                        background: "rgba(99,102,241,0.15)", color: "#a5b4fc",
                        padding: "0.2rem 0.65rem", borderRadius: "999px",
                        fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase",
                      }}>{log.territory}</span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#94a3b8" }}>{log.pages}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span style={{
                        background: sc.bg, color: sc.color,
                        border: `1px solid ${sc.border}`,
                        padding: "0.2rem 0.65rem", borderRadius: "999px",
                        fontSize: "0.75rem", fontWeight: 600,
                      }}>{sc.label}</span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "#e2e8f0" }}>{log.nb_produits}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#64748b", fontSize: "0.78rem" }}>
                      {log.started_at ? new Date(log.started_at).toLocaleString("fr-FR") : "—"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#475569", fontSize: "0.75rem", maxWidth: "250px" }}>
                      <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {log.message || "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
