"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getFastapiToken, removeFastapiToken } from "@/lib/fastapi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Ne pas rediriger si on est déjà sur la page login
    if (pathname === "/dashboard/login") return;

    if (!getFastapiToken()) {
      router.push("/dashboard/login");
    }
  }, [pathname]);

  const handleLogout = () => {
    removeFastapiToken();
    router.push("/dashboard/login");
  };

  // Ne pas afficher la navbar sur la page login
  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar dashboard */}
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-blue-600">KaribMarket Admin</span>
          <Link
            href="/dashboard"
            className={`text-sm ${pathname === "/dashboard" ? "text-blue-600 font-medium" : "text-gray-500 hover:text-gray-800"}`}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/prix"
            className={`text-sm ${pathname === "/dashboard/prix" ? "text-blue-600 font-medium" : "text-gray-500 hover:text-gray-800"}`}
          >
            Prix Kiprix
          </Link>
          <Link
            href="/dashboard/scrape"
            className={`text-sm ${pathname === "/dashboard/scrape" ? "text-blue-600 font-medium" : "text-gray-500 hover:text-gray-800"}`}
          >
            Scraping
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Déconnexion
        </button>
      </nav>

      <main>{children}</main>
    </div>
  );
}
