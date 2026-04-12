"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { getAccessToken, karibFetch, readErrorMessage } from "@/lib/karibdocs-api";

type ScrapedItem = {
    title: string;
    author?: string;
    infos?: string;
    body?: string;
    photo?: string;
    url?: string;
    depth?: number;
};

type ScrapingSource = {
    id: string;
    label: string;
    default_start_url: string;
};

type SaveScrapedResponse = {
    message?: string;
    count?: number;
};

type PersistedScrapingState = {
    items: ScrapedItem[];
    maxDepth: number;
    maxPages: number;
    delay: number;
    search: string;
};

const SCRAPING_STATE_STORAGE_KEY = "karibdocs:rci-scraping-state";

export default function ScrapPage() {
    const [maxDepth, setMaxDepth] = useState(1);
    const [maxPages, setMaxPages] = useState(10);
    const [delay, setDelay] = useState(1.5);
    const [isLoading, setIsLoading] = useState(false);
    const [savingArticleByKey, setSavingArticleByKey] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);
    const [saveMessageByKey, setSaveMessageByKey] = useState<Record<string, string>>({});
    const [items, setItems] = useState<ScrapedItem[]>([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<ScrapedItem | null>(null);
    const [sources, setSources] = useState<ScrapingSource[]>([]);
    const [sourcesError, setSourcesError] = useState<string | null>(null);
    const [isStorageHydrated, setIsStorageHydrated] = useState(false);
    const detailRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") {
            setIsStorageHydrated(true);
            return;
        }

        const raw = window.sessionStorage.getItem(SCRAPING_STATE_STORAGE_KEY);
        if (!raw) {
            return;
        }

        try {
            const parsed = JSON.parse(raw) as Partial<PersistedScrapingState>;

            if (Array.isArray(parsed.items)) {
                setItems(parsed.items as ScrapedItem[]);
            }

            if (typeof parsed.maxDepth === "number") {
                setMaxDepth(parsed.maxDepth);
            }

            if (typeof parsed.maxPages === "number") {
                setMaxPages(parsed.maxPages);
            }

            if (typeof parsed.delay === "number") {
                setDelay(parsed.delay);
            }

            if (typeof parsed.search === "string") {
                setSearch(parsed.search);
            }
        } catch {
            window.sessionStorage.removeItem(SCRAPING_STATE_STORAGE_KEY);
        } finally {
            setIsStorageHydrated(true);
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        if (!isStorageHydrated) {
            return;
        }

        const stateToPersist: PersistedScrapingState = {
            items,
            maxDepth,
            maxPages,
            delay,
            search,
        };

        window.sessionStorage.setItem(SCRAPING_STATE_STORAGE_KEY, JSON.stringify(stateToPersist));
    }, [items, maxDepth, maxPages, delay, search, isStorageHydrated]);

    useEffect(() => {
        if (selected) {
            detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [selected]);

    useEffect(() => {
        async function loadSources() {
            try {
                const response = await karibFetch("/scraping/sources");

                if (!response.ok) {
                    throw new Error(await readErrorMessage(response, "Impossible de charger les sources."));
                }

                const data = (await response.json()) as { sources?: ScrapingSource[] };
                setSources(Array.isArray(data.sources) ? data.sources : []);
            } catch (err) {
                setSourcesError(err instanceof Error ? err.message : "Impossible de charger les sources.");
            }
        }

        loadSources();
    }, []);

    const filteredItems = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) {
            return items;
        }

        return items.filter((item) => {
            const text = [item.title, item.author ?? "", item.infos ?? "", item.body ?? "", item.url ?? ""]
                .join(" ")
                .toLowerCase();
            return text.includes(term);
        });
    }, [items, search]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const token = getAccessToken();

        if (!token) {
            setError("Token absent ou invalide. Connecte-toi pour lancer le scraping.");
            return;
        }

        setError(null);
        setSaveMessageByKey({});
        setIsLoading(true);
        setSelected(null);

        try {
            const query = new URLSearchParams({
                max_depth: String(maxDepth),
                max_pages: String(maxPages),
                delay: String(delay),
            });

            const response = await karibFetch(`/scraping/rci?${query.toString()}`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, `Erreur ${response.status}`));
            }

            const data = (await response.json()) as { items?: ScrapedItem[] };
            setItems(Array.isArray(data.items) ? data.items : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Impossible de lancer le scraping.");
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    }

    function getArticleKey(item: ScrapedItem, index: number): string {
        return `${item.url ?? item.title ?? "article"}-${index}`;
    }

    async function handleSaveArticle(item: ScrapedItem, index: number) {
        const key = getArticleKey(item, index);
        setError(null);
        setSaveMessageByKey((prev) => ({ ...prev, [key]: "" }));
        setSavingArticleByKey((prev) => ({ ...prev, [key]: true }));

        try {
            const response = await karibFetch("/scraping/rci/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ items: [item] }),
            });

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, `Erreur ${response.status}`));
            }

            const data = (await response.json()) as SaveScrapedResponse;
            const count = typeof data.count === "number" ? data.count : 1;
            setSaveMessageByKey((prev) => ({
                ...prev,
                [key]: data.message ?? `${count} article sauvegarde avec succes.`,
            }));
        } catch (err) {
            setSaveMessageByKey((prev) => ({
                ...prev,
                [key]: err instanceof Error ? err.message : "Impossible de sauvegarder cet article.",
            }));
        } finally {
            setSavingArticleByKey((prev) => ({ ...prev, [key]: false }));
        }
    }

    return (
        <div className="container py-4">
            <header className="mb-4">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                    <div>
                        <h1 className="mb-1">RCI Scraper</h1>
                        <p className="text-body-secondary mb-0">Le frontend appelle directement /scraping/sources puis /scraping/rci sur KaribDocs.</p>
                    </div>
                    <Link href="/dashboard/data" className="btn btn-outline-primary btn-sm">
                        Voir les documents indexés
                    </Link>
                </div>
            </header>

            <section className="mb-4">
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <h2 className="h5 mb-2">Sources backend</h2>
                        {sourcesError && <div className="alert alert-warning mb-3">{sourcesError}</div>}
                        {sources.length > 0 ? (
                            <div className="row g-3">
                                {sources.map((source) => (
                                    <div key={source.id} className="col-md-6">
                                        <div className="border rounded-3 p-3 h-100">
                                            <div className="fw-semibold">{source.label}</div>
                                            <div className="small text-body-secondary">{source.id}</div>
                                            <div className="small mt-2">Départ: {source.default_start_url}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-body-secondary mb-0">Aucune source chargée pour le moment.</p>
                        )}
                    </div>
                </div>
            </section>

            <section className="mb-4">
                <div className="card">
                    <div className="card-body">
                        <h2 className="h5 mb-3">Parametres du scraping</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label htmlFor="max-depth" className="form-label">Profondeur max</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        id="max-depth"
                                        value={maxDepth}
                                        min={0}
                                        max={3}
                                        onChange={(event) => setMaxDepth(Number(event.target.value))}
                                    />
                                    <div className="form-text text-muted">0 = page de depart seule, max 3</div>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="max-pages" className="form-label">Pages max</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        id="max-pages"
                                        value={maxPages}
                                        min={1}
                                        max={100}
                                        onChange={(event) => setMaxPages(Number(event.target.value))}
                                    />
                                    <div className="form-text text-muted">Nombre total de pages visitees (1-100)</div>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="delay" className="form-label">Delai (s)</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        id="delay"
                                        value={delay}
                                        min={0.5}
                                        max={10}
                                        step={0.5}
                                        onChange={(event) => setDelay(Number(event.target.value))}
                                    />
                                    <div className="form-text text-muted">Pause entre requetes (0.5-10s)</div>
                                </div>
                            </div>

                            <div className="mt-3 d-flex align-items-center gap-3">
                                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                    {isLoading ? "Scraping en cours..." : "Lancer le scraping"}
                                </button>
                                {items.length > 0 && <span className="text-body-secondary">{items.length} article(s)</span>}
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {error && <div className="alert alert-danger">{error}</div>}

            {items.length > 0 && (
                <section className="mb-4">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Filtrer les articles..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </section>
            )}

            {selected && (
                <section ref={detailRef} className="mb-4">
                    <div className="card border-primary-subtle shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                                <div>
                                    <h2 className="h5 mb-1">{selected.title || "Sans titre"}</h2>
                                    <p className="text-body-secondary small mb-0">
                                        {selected.author ? `Par ${selected.author}` : "Auteur inconnu"}
                                        {selected.infos ? ` - ${selected.infos}` : ""}
                                    </p>
                                </div>
                                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setSelected(null)}>
                                    Fermer
                                </button>
                            </div>

                            {selected.photo && (
                                <div className="position-relative mb-3" style={{ height: 320 }}>
                                    <Image
                                        src={selected.photo}
                                        alt={selected.title || "Illustration de l'article"}
                                        fill
                                        unoptimized
                                        sizes="(max-width: 768px) 100vw, 720px"
                                        style={{ objectFit: "cover" }}
                                        className="rounded"
                                    />
                                </div>
                            )}

                            <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                                {selected.body || "Aucun contenu."}
                            </p>

                            {selected.url && (
                                <div className="mt-3">
                                    <a href={selected.url} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">
                                        Ouvrir la source
                                    </a>
                                </div>
                            )}

                            {(() => {
                                const selectedIndex = items.findIndex((item) => item === selected);
                                const selectedKey = getArticleKey(selected, selectedIndex >= 0 ? selectedIndex : 0);
                                const isSavingSelected = !!savingArticleByKey[selectedKey];
                                const saveMessageSelected = saveMessageByKey[selectedKey];

                                return (
                                    <div className="mt-3">
                                        <button
                                            type="button"
                                            className="btn btn-success btn-sm"
                                            disabled={isSavingSelected}
                                            onClick={() => handleSaveArticle(selected, selectedIndex >= 0 ? selectedIndex : 0)}
                                        >
                                            {isSavingSelected ? "Sauvegarde..." : "SAVE"}
                                        </button>
                                        {saveMessageSelected && <div className="alert alert-info mt-2 mb-0">{saveMessageSelected}</div>}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </section>
            )}

            <main className="mb-4">
                <div className="row g-3">
                    {filteredItems.map((item, index) => (
                        <div className="col-12" key={`${item.url ?? item.title}-${index}`}>
                            <article className="card h-100">
                                <div className="card-body">
                                    <h3 className="h6 mb-1">{item.title || "Sans titre"}</h3>
                                    <p className="text-body-secondary small mb-2">
                                        {item.author ? `Par ${item.author}` : "Auteur inconnu"}
                                        {item.infos ? ` - ${item.infos}` : ""}
                                    </p>
                                    <p className="mb-2" style={{ whiteSpace: "pre-wrap" }}>
                                        {(item.body ?? "").slice(0, 220)}
                                        {(item.body ?? "").length > 220 ? "..." : ""}
                                    </p>
                                    <div className="d-flex gap-2 flex-wrap">
                                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setSelected(item)}>
                                            Voir le detail
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-success btn-sm"
                                            disabled={!!savingArticleByKey[getArticleKey(item, index)]}
                                            onClick={() => handleSaveArticle(item, index)}
                                        >
                                            {savingArticleByKey[getArticleKey(item, index)] ? "Sauvegarde..." : "SAVE"}
                                        </button>
                                        {item.url && (
                                            <a href={item.url} target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm">
                                                Ouvrir la source
                                            </a>
                                        )}
                                    </div>
                                    {saveMessageByKey[getArticleKey(item, index)] && (
                                        <div className="alert alert-info mt-2 mb-0">{saveMessageByKey[getArticleKey(item, index)]}</div>
                                    )}
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </main>

            <footer>
                <p className="text-body-secondary mb-0">&copy; 2026 - Interface de scraping RCI</p>
            </footer>
        </div>
    );
}
