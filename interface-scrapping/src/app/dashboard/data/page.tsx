

"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { karibFetch, readErrorMessage } from "@/lib/karibdocs-api";

type DocumentItem = {
    id: number;
    user_id: number;
    filename: string;
    original_name: string;
    file_type: string | null;
    file_size: number | null;
    source: string;
    drive_file_id: string | null;
    is_indexed: boolean;
    chunk_count: number;
    collection_name: string | null;
    created_at: string;
    updated_at: string;
};

type DocumentListResponse = {
    count: number;
    documents: DocumentItem[];
};

const ACCEPTED_FILE_TYPES = ".pdf,.docx,.txt,.md";

function formatBytes(size: number | null): string {
    if (!size || size <= 0) {
        return "-";
    }

    const units = ["B", "KB", "MB", "GB"];
    let value = size;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }

    return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

export default function DataPage() {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [documentCount, setDocumentCount] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    const [activeActionByDocumentId, setActiveActionByDocumentId] = useState<Record<number, "delete" | "reindex" | undefined>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadDocuments() {
        setLoading(true);
        setError(null);

        try {
            const response = await karibFetch("/documents/");

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, `Erreur ${response.status}`));
            }

            const data = (await response.json()) as DocumentListResponse | DocumentItem[];
            if (Array.isArray(data)) {
                setDocuments(data);
                setDocumentCount(data.length);
            } else {
                const docs = Array.isArray(data.documents) ? data.documents : [];
                setDocuments(docs);
                setDocumentCount(typeof data.count === "number" ? data.count : docs.length);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Impossible de charger les documents.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDocuments();
    }, []);

    async function handleUpload(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setUploadMessage(null);

        if (!selectedFile) {
            setUploadMessage("Selectionne un fichier avant l'envoi.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        setUploading(true);

        try {
            const response = await karibFetch("/documents/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, `Erreur ${response.status}`));
            }

            setSelectedFile(null);
            setUploadMessage("Document uploadé avec succès.");
            await loadDocuments();
        } catch (err) {
            setUploadMessage(err instanceof Error ? err.message : "Impossible d'uploader le document.");
        } finally {
            setUploading(false);
        }
    }

    async function handleDeleteDocument(documentId: number) {
        setActionMessage(null);

        setActiveActionByDocumentId((prev) => ({ ...prev, [documentId]: "delete" }));

        try {
            const response = await karibFetch(`/documents/${documentId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, `Erreur ${response.status}`));
            }

            setActionMessage("Document supprimé avec succès.");
            await loadDocuments();
        } catch (err) {
            setActionMessage(err instanceof Error ? err.message : "Impossible de supprimer le document.");
        } finally {
            setActiveActionByDocumentId((prev) => ({ ...prev, [documentId]: undefined }));
        }
    }

    async function handleReindexDocument(documentId: number) {
        setActionMessage(null);

        setActiveActionByDocumentId((prev) => ({ ...prev, [documentId]: "reindex" }));

        try {
            const response = await karibFetch(`/documents/${documentId}/reindex`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, `Erreur ${response.status}`));
            }

            setActionMessage("Réindexation lancée avec succès.");
            await loadDocuments();
        } catch (err) {
            setActionMessage(err instanceof Error ? err.message : "Impossible de réindexer le document.");
        } finally {
            setActiveActionByDocumentId((prev) => ({ ...prev, [documentId]: undefined }));
        }
    }

    const filteredDocuments = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) {
            return documents;
        }

        return documents.filter((doc) => {
            const haystack = [
                doc.original_name,
                doc.filename,
                doc.source,
                doc.file_type ?? "",
                doc.collection_name ?? "",
                doc.drive_file_id ?? "",
            ]
                .join(" ")
                .toLowerCase();
            return haystack.includes(term);
        });
    }, [documents, search]);

    return (
        <div className="container py-4">
            <header className="mb-3">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                    <div>
                        <h1 className="h4 mb-2">Collections de data</h1>
                        <p className="text-body-secondary mb-0">Documents issus de /documents, avec upload, suppression, réindexation et origine Drive.</p>
                    </div>
                    <Link href="/dashboard/drive" className="btn btn-outline-primary btn-sm">
                        Ouvrir Google Drive
                    </Link>
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        id="search-bar"
                        className="form-control"
                        placeholder="Rechercher par nom, source, type ou collection..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
            </header>

            <section className="mb-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <h2 className="h5 mb-2">Uploader un document</h2>
                        <p className="text-body-secondary mb-3">
                            Envoyez un fichier PDF, DOCX, TXT ou MD pour l&apos;enregistrer via POST /documents/upload.
                        </p>
                        <form onSubmit={handleUpload}>
                            <div className="row g-3 align-items-end">
                                <div className="col-md-8">
                                    <label htmlFor="document-file" className="form-label">
                                        Fichier
                                    </label>
                                    <input
                                        id="document-file"
                                        className="form-control"
                                        type="file"
                                        accept={ACCEPTED_FILE_TYPES}
                                        onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                                    />
                                </div>
                                <div className="col-md-4 d-grid">
                                    <button type="submit" className="btn btn-primary" disabled={uploading}>
                                        {uploading ? "Upload en cours..." : "Uploader le document"}
                                    </button>
                                </div>
                            </div>
                        </form>
                        {selectedFile && <p className="text-body-secondary small mt-2 mb-0">Fichier sélectionné: {selectedFile.name}</p>}
                        {uploadMessage && <div className="alert alert-info mt-3 mb-0">{uploadMessage}</div>}
                    </div>
                </div>
            </section>

            <section className="mb-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <div>
                            <h2 className="h6 mb-1">Import Google Drive</h2>
                            <p className="text-body-secondary mb-0">Les fichiers Drive sont indexés dans le même espace documentaire que les uploads.</p>
                        </div>
                        <Link href="/dashboard/drive" className="btn btn-outline-secondary">
                            Connecter et synchroniser
                        </Link>
                    </div>
                </div>
            </section>

            {!loading && !error && (
                <p className="text-body-secondary mb-3">
                    {filteredDocuments.length} document(s) affiché(s) depuis /documents/
                    {documentCount !== null ? ` sur ${documentCount}` : ""}
                </p>
            )}

            <main id="news-container">
                {loading && <p id="loading-state">Chargement des donnees...</p>}

                {!loading && error && <div className="alert alert-danger">{error}</div>}

                {!loading && !error && documents.length === 0 && (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body py-4">
                            <h2 className="h5 mb-2">Aucun document uploadé</h2>
                            <p className="text-body-secondary mb-0">
                                Les documents envoyés par cet utilisateur apparaîtront ici dès qu’ils seront enregistrés en base.
                            </p>
                        </div>
                    </div>
                )}

                {!loading && !error && documents.length > 0 && (
                    <div className="card">
                        {actionMessage && <div className="alert alert-info m-3 mb-0">{actionMessage}</div>}
                        <div className="table-responsive">
                            <table className="table mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th>Nom original</th>
                                        <th>Nom fichier</th>
                                        <th>Type</th>
                                        <th>Source</th>
                                        <th>Collection</th>
                                        <th>Taille</th>
                                        <th>Indexe</th>
                                        <th>Chunks</th>
                                        <th>Ajoute le</th>
                                        <th>Maj le</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDocuments.length === 0 && (
                                        <tr>
                                            <td colSpan={11} className="text-body-secondary">
                                                Aucun document ne correspond à cette recherche.
                                            </td>
                                        </tr>
                                    )}

                                    {filteredDocuments.map((doc) => {
                                        const activeAction = activeActionByDocumentId[doc.id];
                                        const isDeleting = activeAction === "delete";
                                        const isReindexing = activeAction === "reindex";

                                        return (
                                            <tr key={doc.id}>
                                                <td>{doc.original_name}</td>
                                                <td>{doc.filename}</td>
                                                <td>{doc.file_type ?? "-"}</td>
                                                <td>{doc.source}</td>
                                                <td>{doc.collection_name ?? "-"}</td>
                                                <td>{formatBytes(doc.file_size)}</td>
                                                <td>{doc.is_indexed ? "Oui" : "Non"}</td>
                                                <td>{doc.chunk_count}</td>
                                                <td>{new Date(doc.created_at).toLocaleString()}</td>
                                                <td>{new Date(doc.updated_at).toLocaleString()}</td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-secondary"
                                                            disabled={isDeleting || isReindexing}
                                                            onClick={() => handleReindexDocument(doc.id)}
                                                        >
                                                            {isReindexing ? "Réindexation..." : "Réindexer"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            disabled={isDeleting || isReindexing}
                                                            onClick={() => handleDeleteDocument(doc.id)}
                                                        >
                                                            {isDeleting ? "Suppression..." : "Supprimer"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            <footer className="mt-3">
                <p className="text-body-secondary mb-0">&copy; 2026 - Interface de demonstration de donnees RCI</p>
            </footer>
        </div>
    );
}
