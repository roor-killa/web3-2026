"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAccessToken } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (getAccessToken()) {
      router.replace('/products');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <main className="flex flex-col items-center justify-center gap-12 text-center py-32 px-16 max-w-2xl">
        <div>
          <h1 className="text-5xl font-bold text-zinc-100 mb-4">
            Bienvenue
          </h1>
          <p className="text-xl text-zinc-400 mb-8">
            Connectez-vous pour acceder au catalogue de produits
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="inline-block px-6 py-3 border border-zinc-700 text-zinc-200 font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors"
          >
            S&apos;inscrire
          </Link>
          <Link
            href="/products"
            className="inline-block px-6 py-3 border border-zinc-700 text-zinc-200 font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors"
          >
            Voir les produits
          </Link>
        </div>
      </main>
    </div>
  );
}
