// Page produits (client) : liste avec boutons CRUD (Créer, Lire, Modifier, Supprimer).
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  created_at?: string;
  updated_at?: string;
}

const productIcons: { [key: number]: string } = {
  1: '💻',
  2: '📱',
  3: '🎧',
  4: '🖥️',
  5: '⌨️',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Charger les produits au montage du composant
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/products');

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des produits');
      }

      const data: Product[] = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fonction pour supprimer un produit (DELETE)
  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Recharger les produits après la suppression
      setProducts(products.filter(p => p.id !== id));
      alert('✅ Produit supprimé avec succès !');
    } catch (err) {
      alert('❌ Erreur : ' + (err instanceof Error ? err.message : 'Impossible de supprimer'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header avec bouton Créer */}
        <div className="text-center mb-16 flex flex-col items-center">
          <h1 className="text-6xl font-black text-white mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Notre Catalogue Exclusif
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Découvrez une sélection premium des meilleurs produits technologiques
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full mb-8"></div>

          {/* Bouton Créer un produit */}
          <Link
            href="/products/create"
            className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50"
          >
            ➕ Créer un Produit
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-cyan-400"></div>
              <div className="text-white text-center mt-4 text-lg font-semibold">Chargement...</div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 border-2 border-red-500 backdrop-blur-sm text-red-200 px-6 py-4 rounded-2xl mb-8 text-center">
            <p className="font-semibold text-lg">❌ {error}</p>
            <p className="text-sm mt-2">Assurez-vous que le serveur Laravel tourne sur localhost:8000</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {products.map((product) => (
                <div key={product.id} className="group relative">
                  {/* Glow Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>

                  {/* Card */}
                  <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
                    {/* Header Gradient */}
                    <div className="h-40 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-b border-slate-700/50 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <span className="text-7xl drop-shadow-lg group-hover:scale-125 transition-transform duration-300">
                        {productIcons[product.id] || '📦'}
                      </span>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      {/* Badge */}
                      <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold px-4 py-2 rounded-full mb-4 backdrop-blur-sm">
                        #PRODUIT {product.id}
                      </div>

                      {/* Product Name */}
                      <h2 className="text-2xl font-black text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                        {product.name}
                      </h2>

                      {/* Description */}
                      <p className="text-gray-400 text-sm mb-5 leading-relaxed line-clamp-3">
                        {product.description}
                      </p>

                      {/* Price Box */}
                      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6">
                        <div className="flex items-end justify-between">
                          <span className="text-gray-400 text-sm font-semibold">Prix</span>
                          <span className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            {product.price.toFixed(2)}€
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3">
                        {/* First row: Details and Edit */}
                        <div className="flex gap-3">
                          <Link
                            href={`/products/${product.id}`}
                            className="flex-1 bg-slate-700/50 hover:bg-slate-700 border-2 border-blue-500/50 text-blue-300 hover:text-blue-200 font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-center text-sm"
                          >
                            👁️ Détails
                          </Link>
                          <Link
                            href={`/products/edit/${product.id}`}
                            className="flex-1 bg-slate-700/50 hover:bg-slate-700 border-2 border-yellow-500/50 text-yellow-300 hover:text-yellow-200 font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-center text-sm"
                          >
                            ✏️ Modifier
                          </Link>
                        </div>

                        {/* Second row: Delete */}
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="w-full bg-slate-700/50 hover:bg-red-600 border-2 border-red-500/50 text-red-300 hover:text-red-100 font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Stats */}
            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 backdrop-blur-sm rounded-full px-8 py-4">
                <p className="text-gray-300">
                  📦 <span className="font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">{products.length} produits</span> disponibles
                </p>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-400 mb-8">❌ Aucun produit trouvé</p>
            <Link
              href="/products/create"
              className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              ➕ Ajouter le premier produit
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
