// Page détails d'un produit (client) : affiche les infos complètes d'un produit
// et permet de revenir à la liste ou d'aller à la page de modification.
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/products/${id}`);

        if (!response.ok) {
          throw new Error('Produit non trouvé');
        }

        const data: Product = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-cyan-400 mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 text-2xl font-bold mb-8">❌ {error || 'Produit non trouvé'}</p>
          <Link href="/products" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
            ← Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/products" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            ← Retour aux produits
          </Link>
        </div>

        {/* Product Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>

          <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-700/50 p-8 md:p-12">
            {/* Header */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Left: Image placeholder */}
              <div className="flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl h-80 border border-slate-700/50">
                <span className="text-9xl">📦</span>
              </div>

              {/* Right: Product info */}
              <div className="flex flex-col justify-center">
                <div className="inline-block bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold px-4 py-2 rounded-full mb-4 w-fit">
                  #PRODUIT {product.id}
                </div>

                <h1 className="text-5xl font-black text-white mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {product.name}
                </h1>

                <div className="mb-6">
                  <p className="text-gray-400 mb-2">Prix:</p>
                  <p className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {product.price.toFixed(2)}€
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-12 pb-8 border-b border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {product.description || 'Aucune description disponible'}
              </p>
            </div>

            {/* Metadata */}
            {(product.created_at || product.updated_at) && (
              <div className="grid md:grid-cols-2 gap-4 mb-12 pb-8 border-b border-slate-700/50">
                {product.created_at && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Créé le</p>
                    <p className="text-white">
                      {new Date(product.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}
                {product.updated_at && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Mis à jour le</p>
                    <p className="text-white">
                      {new Date(product.updated_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Link
                href={`/products/edit/${product.id}`}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-center"
              >
                ✏️ Modifier
              </Link>
              <Link
                href="/products"
                className="flex-1 bg-slate-700/50 hover:bg-slate-700 border-2 border-cyan-500/50 text-cyan-300 hover:text-cyan-200 font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-center"
              >
                ← Retour
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
