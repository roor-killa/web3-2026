'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number | null;
  sku: string | null;
  created_at: string;
  updated_at: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Assurez-vous que l'URL correspond à votre API Laravel
        const response = await fetch('http://localhost:8001/api/products');
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-red-600 text-xl">
          <p>Erreur: {error}</p>
          <p className="text-sm mt-2">Assurez-vous que le serveur Laravel est en cours d'exécution sur http://localhost:8000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Produits</h1>
        
        {products.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">Aucun produit disponible</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h2>
                
                {product.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {product.description}
                  </p>
                )}
                
                <div className="space-y-2 mb-4">
                  {product.sku && (
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">SKU:</span> {product.sku}
                    </p>
                  )}
                  {product.quantity !== null && (
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Quantité:</span> {product.quantity}
                    </p>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-3xl font-bold text-blue-600">
                    {parseFloat(String(product.price)).toFixed(2)} €
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
