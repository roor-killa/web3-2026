'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setIsLoading(true);
    try {
      await login({ email, password });
      router.push("/products");
    } catch (err: any) {
      setError(err.message || "Identifiants incorrects");
    } finally { setIsLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '64px', height: '64px', margin: '0 auto 1rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', boxShadow: '0 8px 20px rgba(99,102,241,0.4)' }}>🔐</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>Connexion</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Accédez à votre espace personnel</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Adresse email</label>
              <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} required
                style={{ width: '100%', padding: '0.65rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '0.9rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required
                  style={{ width: '100%', padding: '0.65rem 3rem 0.65rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '0.9rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              style={{ padding: '0.75rem', background: isLoading ? '#a5b4fc' : 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '0.75rem', fontSize: '0.95rem', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.4)', marginTop: '0.5rem' }}>
              {isLoading ? '⏳ Connexion...' : '🚀 Se connecter'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748b', marginTop: '1.5rem', marginBottom: 0 }}>
            Pas encore de compte ?{' '}
            <Link href="/register" style={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>Créer un compte</Link>
          </p>
        </div>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginTop: '1rem' }}>
          Plateforme sécurisée — WebStore 2026
        </p>
      </div>
    </div>
  );
}
