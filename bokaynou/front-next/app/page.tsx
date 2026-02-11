"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  product_name: string;
  product_price: number;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8001/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des produits");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 p-8 font-sans dark:bg-black">
      <main className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-semibold text-black dark:text-zinc-50">
          Nos Produits
        </h1>

        {loading && <p className="text-zinc-500">Chargement...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="text-xl font-medium text-black dark:text-zinc-50">
                {product.product_name}
              </h2>
              <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
                {product.product_price} €
              </p>
            </div>
          ))}
        </div>

        {!loading && !error && products.length === 0 && (
          <p className="text-zinc-500">Aucun produit trouvé.</p>
        )}
      </main>
    </div>
  );
}
