export default function ScrapPage() {
  return (
        <div className="container py-4">
            <header className="mb-4">
                <h1 className="mb-1">RCI Scraper</h1>
                <p id="current-date" className="text-body-secondary mb-3" />
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <h2 className="h4 mb-0">Portail d&apos;Information</h2>
                </div>
            </header>

            <section id="controls" className="mb-4">
                <div className="card">
                    <div className="card-body">
                        <h3 className="h5 mb-3">Parametres du scraping</h3>
                        <form id="scrape-form">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="mb-2">
                                        <label htmlFor="max-depth" className="form-label">Profondeur max</label>
                                        <input className="form-control" type="number" id="max-depth" defaultValue={1} min={0} max={3} />
                                        <div className="form-text text-muted">0 = page de depart seule, max 3</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-2">
                                        <label htmlFor="max-pages" className="form-label">Pages max</label>
                                        <input className="form-control" type="number" id="max-pages" defaultValue={10} min={1} max={100} />
                                        <div className="form-text text-muted">Nombre total de pages visitees (1-100)</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-2">
                                        <label htmlFor="delay" className="form-label">Delai (s)</label>
                                        <input className="form-control" type="number" id="delay" defaultValue={1.5} min={0.5} max={10} step={0.5} />
                                        <div className="form-text text-muted">Pause entre requetes (0.5-10s)</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <button type="submit" id="btn-scrape" className="btn btn-primary">Lancer le scraping</button>
                            </div>
                        </form>

                        <div id="status-bar" className="d-none mt-3 align-items-center gap-2">
                            <div id="spinner" className="spinner-border spinner-border-sm" role="status" />
                            <span id="status-text">En attente...</span>
                        </div>
                    </div>
                </div>
            </section>

            <section id="search-section" className="d-none mb-4">
                <input className="form-control" type="text" id="search-bar" placeholder="Filtrer les articles..." />
            </section>

            <main id="news-container" className="mb-4" />

            <section id="article-overlay" className="d-none mb-4">
                <div id="article-detail" className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-end">
                            <button id="btn-close" type="button" className="btn btn-outline-secondary btn-sm" aria-label="Fermer">x</button>
                        </div>
                        <div id="article-detail-content" />
                    </div>
                </div>
            </section>

            <footer>
                <p className="text-body-secondary mb-0">&copy; 2026 - Interface de scraping RCI</p>
            </footer>
        </div>
  );
}
