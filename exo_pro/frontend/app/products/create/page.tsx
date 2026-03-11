// Page créer un produit (client) : formulaire pour ajouter un nouveau produit
// utilisant POST /api/products.
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
  });

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
    setLoading(true);

    try {
      // Validation basique
      if (!formData.name.trim() || !formData.price.trim()) {
        throw new Error('Le nom et le prix sont obligatoires');
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        throw new Error('Le prix doit être un nombre positif');
      }

      // Envoyer les données à l'API
      const response = await fetch('http://localhost:8000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          price: price,
          description: formData.description.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création');
      }

      alert('✅ Produit créé avec succès !');
      router.push('/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/products" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            ← Retour aux produits
          </Link>
        </div>

        {/* Form Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>

          <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-700/50 p-8 md:p-12">
            {/* Header */}
            <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              ➕ Créer un Produit
            </h1>
            <p className="text-gray-400 mb-8">Remplissez les informations pour ajouter un nouveau produit</p>

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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ En cours...' : '✅ Créer le Produit'}
                </button>
                <Link
                  href="/products"
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
