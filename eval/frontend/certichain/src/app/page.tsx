"use client";

import { useState, useEffect } from "react";

interface Certificate {
  id: number;
  student_name: string;
  certification_title: string;
  issue_date: string;
  blockchain_hash: string;
  created_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function Home() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    student_name: "",
    certification_title: "",
    issue_date: "",
    blockchain_hash: "",
  });

  // Fetch certificates on load
  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await fetch(`${API_URL}/certificates`);
      const data = await res.json();
      setCertificates(data.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/certificates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ student_name: "", certification_title: "", issue_date: "", blockchain_hash: "" });
        setShowForm(false);
        fetchCertificates();
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    }
  };

  const generateHash = () => {
    const hash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setFormData({ ...formData, blockchain_hash: hash });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">CertiChain</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Certificats Numériques Web3</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            📜 Liste des Certificats
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {showForm ? "✕ Fermer" : "➕ Ajouter un certificat"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Nouveau Certificat
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom de l'étudiant"
                value={formData.student_name}
                onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
              <input
                type="text"
                placeholder="Intitulé de la certification"
                value={formData.certification_title}
                onChange={(e) => setFormData({ ...formData, certification_title: e.target.value })}
                className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
              <input
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Hash blockchain"
                  value={formData.blockchain_hash}
                  onChange={(e) => setFormData({ ...formData, blockchain_hash: e.target.value })}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={generateHash}
                  className="px-4 py-3 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  title="Générer un hash"
                >
                  🎲
                </button>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  ✓ Créer le certificat
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Certificates List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-500">Chargement...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Aucun certificat trouvé</p>
            <p className="text-gray-400 dark:text-gray-500 mt-2">Cliquez sur Ajouter pour créer le premier certificat</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      🎓 {cert.student_name}
                    </h3>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {cert.certification_title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      📅 Émis le {new Date(cert.issue_date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 max-w-md">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">🔗 Hash Blockchain</p>
                    <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
                      {cert.blockchain_hash}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>CertiChain © 2026 - Application Web3 de Certificats Numériques</p>
      </footer>
    </div>
  );
}
