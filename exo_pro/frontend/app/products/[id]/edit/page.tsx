// Page modifier un produit (client) : formulaire pré-rempli pour modifier
// les infos d'un produit existant, utilisant PUT /api/products/:id.
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
  });

  // Charger le produit
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/products/${id}`);

        if (!response.ok) {
          throw new Error('Produit non trouvé');
        }

        const product: Product = await response.json();
        setFormData({
          name: product.name,
          price: product.price.toString(),
          description: product.description || '',
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur au chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Validation
      if (!formData.name.trim() || !formData.price.trim()) {
        throw new Error('Le nom et le prix sont obligatoires');
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        throw new Error('Le prix doit être un nombre positif');
      }

      // Envoyer les modifications à l'API
      const response = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          price: price,
          description: formData.description.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification');
      }

      alert('✅ Produit modifié avec succès !');
      router.push(`/products/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

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

  if (error && loading === false && !formData.name) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 text-2xl font-bold mb-8">❌ {error}</p>
          <Link href="/products" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl">
            ← Retour
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href={`/products/${id}`} className="text-cyan-400 hover:text-cyan-300 transition-colors">
            ← Retour au produit
          </Link>
        </div>

        {/* Form Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>

          <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-700/50 p-8 md:p-12">
            {/* Header */}
            <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              ✏️ Modifier le Produit
            </h1>
            <p className="text-gray-400 mb-8">Mettez à jour les informations du produit</p>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border-2 border-red-500 text-red-200 px-6 py-4 rounded-xl mb-8">
                <p className="font-semibold">❌ {error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-white font-bold mb-2">Nom du Produit *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Laptop Dell XPS"
                  className="w-full bg-slate-700/50 border-2 border-cyan-500/30 text-white placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-400 transition-all"
                  disabled={submitting}
                  required
                />
              </div>

              {/* Price Input */}
              <div>
                <label className="block text-white font-bold mb-2">Prix (€) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Ex: 999.99"
                  step="0.01"
                  min="0"
                  className="w-full bg-slate-700/50 border-2 border-cyan-500/30 text-white placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-400 transition-all"
                  disabled={submitting}
                  required
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-white font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Ex: Ordinateur portable haute performance..."
                  rows={5}
                  className="w-full bg-slate-700/50 border-2 border-cyan-500/30 text-white placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-400 transition-all resize-none"
                  disabled={submitting}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? '⏳ En cours...' : '✅ Enregistrer les modifications'}
                </button>
                <Link
                  href={`/products/${id}`}
                  className="flex-1 bg-slate-700/50 hover:bg-slate-700 border-2 border-cyan-500/50 text-cyan-300 hover:text-cyan-200 font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-center"
                >
                  ← Annuler
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
