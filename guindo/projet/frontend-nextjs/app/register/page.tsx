'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiPost, setToken, ApiResponse } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (password !== passwordConfirmation) { setError("Les mots de passe ne correspondent pas"); return; }
    setIsLoading(true);
    try {
      const data = await apiPost<ApiResponse & { access_token?: string }>('/auth/register', { name, email, password, password_confirmation: passwordConfirmation });
      if (data.access_token) setToken(data.access_token);
      router.push("/products");
    } catch (err: any) { setError(err.message || "Erreur lors de l'inscription"); }
    finally { setIsLoading(false); }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.65rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '0.9rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: '#f8fafc' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '64px', height: '64px', margin: '0 auto 1rem', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', boxShadow: '0 8px 20px rgba(16,185,129,0.4)' }}>📝</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>Inscription</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Créez votre compte WebStore</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div><label style={labelStyle}>Nom complet</label><input type="text" placeholder="Jean Dupont" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} /></div>
            <div><label style={labelStyle}>Adresse email</label><input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} /></div>
            <div><label style={labelStyle}>Mot de passe</label><input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} /></div>
            <div><label style={labelStyle}>Confirmer le mot de passe</label><input type="password" placeholder="••••••••" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} required style={inputStyle} /></div>

            <button type="submit" disabled={isLoading}
              style={{ padding: '0.75rem', background: isLoading ? '#6ee7b7' : 'linear-gradient(90deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '0.75rem', fontSize: '0.95rem', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.4)', marginTop: '0.5rem' }}>
              {isLoading ? '⏳ Création...' : '✅ Créer mon compte'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748b', marginTop: '1.5rem', marginBottom: 0 }}>
            Déjà un compte ?{' '}
            <Link href="/login" style={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
