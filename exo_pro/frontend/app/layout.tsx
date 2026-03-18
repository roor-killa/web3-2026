// Layout racine : enveloppe toute l'appli avec AuthProvider et la NavBar.
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Shop - Catalogue & Événements',
  description: 'Découvrez nos produits et événements exclusifs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <NavBar />
          {children}
          <footer className="bg-gray-900 text-white py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p>&copy; 2026 E-Shop. Tous droits réservés.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
