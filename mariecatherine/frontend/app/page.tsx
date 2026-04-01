"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Liste des produits</h1>

      {products.map(p => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            marginBottom: 12,
            borderRadius: 6
          }}
        >
          <h2>{p.name}</h2>
          <p>{p.description}</p>
          <strong>{p.price} €</strong>
        </div>
      ))}
    </main>
  );
}
