import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="flex flex-col items-center justify-center gap-12 text-center py-32 px-16 max-w-2xl">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bienvenue
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Découvrez notre catalogue de produits
          </p>
        </div>
        
        <Link
          href="/products"
          className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-lg"
        >
          Voir nos produits
        </Link>
      </main>
    </div>
  );
}
