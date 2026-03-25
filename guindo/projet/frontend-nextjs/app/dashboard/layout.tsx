"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getFastapiToken, removeFastapiToken } from "@/lib/fastapi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/dashboard/login") return;
    if (!getFastapiToken()) router.push("/dashboard/login");
  }, [pathname]);

  const handleLogout = () => {
    removeFastapiToken();
    router.push("/dashboard/login");
  };

  if (pathname === "/dashboard/login") return <>{children}</>;

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/prix", label: "Prix Kiprix", icon: "💰" },
    { href: "/dashboard/scrape", label: "Scraping", icon: "🕷️" },
    { href: "/dashboard/chatbot", label: "Chatbot", icon: "🤖" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(11,18,32,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "0 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "56px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {/* Logo */}
          <Link href="/dashboard" style={{
            fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.02em",
            background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            textDecoration: "none",
          }}>
            KaribMarket
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {links.map(({ href, label, icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.35rem 0.85rem", borderRadius: "0.6rem",
                  fontSize: "0.82rem", fontWeight: active ? 600 : 400,
                  textDecoration: "none",
                  background: active ? "rgba(124,58,237,0.2)" : "transparent",
                  color: active ? "#a78bfa" : "#94a3b8",
                  border: active ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
                  transition: "all 0.15s ease",
                }}>
                  <span style={{ fontSize: "0.9rem" }}>{icon}</span>
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        <button onClick={handleLogout} style={{
          fontSize: "0.78rem", fontWeight: 600,
          color: "#f87171", background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.25)", borderRadius: "0.6rem",
          padding: "0.35rem 0.85rem", cursor: "pointer",
          transition: "all 0.15s ease",
        }}>
          Déconnexion
        </button>
      </nav>

      <main>{children}</main>
    </div>
  );
}
