"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fastapiLogin } from "@/lib/fastapi";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await fastapiLogin(email, password);
      router.push("/dashboard");
    } catch {
      setError("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(circle at 20% 30%, rgba(124,58,237,0.3), transparent 40%), radial-gradient(circle at 80% 70%, rgba(14,165,233,0.2), transparent 35%), linear-gradient(135deg, #0b1220, #091020)",
    }}>
      {/* Decorative glow */}
      <div style={{
        position: "absolute", width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%", maxWidth: "400px", padding: "2.5rem",
        background: "rgba(15,23,42,0.85)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.25rem",
        boxShadow: "0 30px 60px rgba(2,9,27,0.6)",
        position: "relative",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "56px", height: "56px", margin: "0 auto 1rem",
            background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
            borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem", boxShadow: "0 8px 24px rgba(124,58,237,0.4)",
          }}>🌺</div>
          <h1 style={{
            fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em",
            background: "linear-gradient(90deg, #e2e8f0, #a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>KaribMarket Admin</h1>
          <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.35rem" }}>
            Connexion au dashboard
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5", padding: "0.75rem 1rem", borderRadius: "0.75rem",
            fontSize: "0.85rem", marginBottom: "1.25rem",
          }}>⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.4rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Email
            </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="admin@karib.com"
              style={{
                width: "100%", padding: "0.65rem 1rem", borderRadius: "0.75rem",
                background: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.2)",
                color: "#e2e8f0", fontSize: "0.9rem", outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.4rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Mot de passe
            </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{
                width: "100%", padding: "0.65rem 1rem", borderRadius: "0.75rem",
                background: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.2)",
                color: "#e2e8f0", fontSize: "0.9rem", outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            marginTop: "0.5rem", padding: "0.75rem",
            background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(90deg, #6366f1, #8b5cf6)",
            color: "white", border: "none", borderRadius: "0.75rem",
            fontSize: "0.9rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 6px 20px rgba(99,102,241,0.35)",
            transition: "all 0.2s ease",
          }}>
            {loading ? "Connexion..." : "Se connecter →"}
          </button>
        </form>
      </div>
    </div>
  );
}
