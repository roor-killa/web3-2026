import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="text-center z-10">
        {/* Main Title */}
        <h1 className="text-7xl md:text-8xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
          🚀 E-SHOP
        </h1>
        
        <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-bold">
          La boutique Tech du futur
        </p>
        
        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Découvrez une sélection <span className="text-cyan-400 font-bold">premium</span> des meilleurs produits technologiques avec des prix imbattables
        </p>
        
        <Link
          href="/products"
          className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-110 text-lg shadow-2xl hover:shadow-cyan-500/50 mb-16"
        >
          ✨ VOIR LE CATALOGUE →
        </Link>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
          {/* Feature 1 */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="font-bold text-xl text-white mb-2">Produits Premium</h3>
              <p className="text-gray-400 text-sm">Sélection rigoureuse des meilleurs produits haute qualité</p>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="font-bold text-xl text-white mb-2">Livraison Express</h3>
              <p className="text-gray-400 text-sm">Expédition en 24-48h vers toute la France</p>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
              <div className="text-5xl mb-4">💯</div>
              <h3 className="font-bold text-xl text-white mb-2">Garantie 100%</h3>
              <p className="text-gray-400 text-sm">Remboursement sans questions en 30 jours</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 flex justify-around max-w-2xl mx-auto text-center">
          <div>
            <div className="text-4xl font-black text-cyan-400">5+</div>
            <p className="text-gray-400 text-sm mt-2">Produits en stock</p>
          </div>
          <div className="border-l border-r border-slate-700 px-8">
            <div className="text-4xl font-black text-purple-400">1000+</div>
            <p className="text-gray-400 text-sm mt-2">Clients satisfaits</p>
          </div>
          <div>
            <div className="text-4xl font-black text-blue-400">⭐ 4.9</div>
            <p className="text-gray-400 text-sm mt-2">Note moyenne</p>
          </div>
        </div>
      </div>
    </div>
  );
}
