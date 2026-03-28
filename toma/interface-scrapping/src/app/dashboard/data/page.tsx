

export default function DataPage() {
  return (
    <div className="container py-4">
        <header>
            <div className="header-nav">
                <h1>Collections de data</h1>
            </div>
            <p id="current-date"></p>
            <div className="search-container">
                <input
                    type="text"
                    id="search-bar"
                    className="form-control"
                    placeholder="Rechercher un article (titre, auteur, contenu)..."
                />
            </div>
        </header>

        <main id="news-container">
            <p id="loading-state">Chargement des actualités...</p>
        </main>

        <footer>
            <p>&copy; 2026 - Interface de démonstration de données RCI</p>
        </footer>
    </div>
  );
}
