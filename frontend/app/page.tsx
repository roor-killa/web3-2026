"use client";

import { useState } from "react";

export default function Home() {
  const produits = [
    { id: 1, nom: "Rhum vieux", prix: 5 },
    { id: 2, nom: "Jus de raisin", prix: 2.5 },
    { id: 3, nom: "Pizza", prix: 15 },
  ];

  const [panier, setPanier] = useState<typeof produits>([]);

  const ajouterAuPanier = (produit: any) => {
    setPanier([...panier, produit]);
  };

  const supprimerDuPanier = (index: number) => {
    const nouveauPanier = panier.filter((_, i) => i !== index);
    setPanier(nouveauPanier);
  };

  const total = panier.reduce((acc, item) => acc + item.prix, 0);

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🛒 Boutique
      </h1>

      {/* Produits */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {produits.map((produit) => (
          <div
            key={produit.id}
            className="bg-white shadow-lg rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold mb-2">
              {produit.nom}
            </h2>
            <p className="text-lg font-bold text-green-600 mb-4">
              {produit.prix.toFixed(2)} €
            </p>
            <button
              onClick={() => ajouterAuPanier(produit)}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
            >
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>

      {/* Panier */}
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">🧺 Panier</h2>

        {panier.length === 0 ? (
          <p className="text-gray-500">Le panier est vide</p>
        ) : (
          <>
            <ul className="space-y-3 mb-4">
              {panier.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span>
                    {item.nom} - {item.prix.toFixed(2)} €
                  </span>
                  <button
                    onClick={() => supprimerDuPanier(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>

            <div className="text-right font-bold text-lg">
              Total : {total.toFixed(2)} €
            </div>
          </>
        )}
      </div>
    </main>
  );
}
