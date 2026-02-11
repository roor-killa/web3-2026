import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Shop - Catalogue de Produits',
  description: 'Découvrez notre catalogue de produits exclusifs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <nav className="bg-indigo-700 text-white py-4 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="text-2xl font-bold">E-Shop</div>
            <div className="flex gap-6">
              <a href="/" className="hover:text-indigo-200 transition-colors">
                Accueil
              </a>
              <a href="/products" className="hover:text-indigo-200 transition-colors">
                Produits
              </a>
              <a href="#" className="hover:text-indigo-200 transition-colors">
                Panier
              </a>
            </div>
          </div>
        </nav>
        {children}
        <footer className="bg-gray-900 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2026 E-Shop. Tous droits réservés.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
