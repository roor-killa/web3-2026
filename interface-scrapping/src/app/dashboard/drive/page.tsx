"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { karibFetch, readErrorMessage } from "@/lib/karibdocs-api";

type DriveFile = {
    id: string;
    name: string;
    mimeType: string;
    size?: string;
    modifiedTime?: string;
};

type DriveListResponse = {
    files: DriveFile[];
    count: number;
};

export default function DrivePage() {
    const [folderId, setFolderId] = useState("");
    const [files, setFiles] = useState<DriveFile[]>([]);
    const [count, setCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [syncingFileId, setSyncingFileId] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function connectDrive() {
        setMessage(null);
        setError(null);

        try {
            const response = await karibFetch("/drive/connect");

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, "Impossible de générer le lien Google Drive."));
            }

            const data = (await response.json()) as { auth_url?: string };
            if (!data.auth_url) {
                throw new Error("Lien d'autorisation Google manquant.");
            }

            window.open(data.auth_url, "_blank", "noopener,noreferrer");
            setMessage("Fenêtre Google ouverte. Termine la connexion puis recharge la liste des fichiers.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Connexion Google Drive impossible.");
        }
    }

    const loadFiles = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const query = folderId.trim() ? `?folder_id=${encodeURIComponent(folderId.trim())}` : "";
            const response = await karibFetch(`/drive/files${query}`);

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, "Impossible de charger les fichiers Drive."));
            }

            const data = (await response.json()) as DriveListResponse;
            setFiles(Array.isArray(data.files) ? data.files : []);
            setCount(typeof data.count === "number" ? data.count : null);
            setMessage("Liste Drive synchronisée avec le backend.");
        } catch (err) {
            setFiles([]);
            setCount(null);
            setError(err instanceof Error ? err.message : "Impossible de charger les fichiers Drive.");
        } finally {
            setLoading(false);
        }
    }, [folderId]);

    async function syncFile(fileId: string) {
        setMessage(null);
        setError(null);
        setSyncingFileId(fileId);

        try {
            const response = await karibFetch(`/drive/sync/${fileId}`, { method: "POST" });

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, "Impossible de synchroniser ce fichier."));
            }

            const data = await response.json().catch(() => null);
            setMessage(data?.message ?? "Fichier Drive synchronisé et indexé.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Synchronisation impossible.");
        } finally {
            setSyncingFileId(null);
        }
    }

    useEffect(() => {
        void loadFiles();
    }, [loadFiles]);

    return (
        <div className="container py-4">
            <header className="mb-4 d-flex flex-wrap justify-content-between align-items-start gap-3">
                <div>
                    <h1 className="h4 mb-1">Google Drive</h1>
                    <p className="text-body-secondary mb-0">Connexion OAuth, liste des fichiers et synchronisation vers /documents.</p>
                </div>
                <div className="d-flex gap-2">
                    <Link href="/dashboard/data" className="btn btn-outline-primary btn-sm">
                        Documents
                    </Link>
                    <Link href="/dashboard/chatbot" className="btn btn-outline-secondary btn-sm">
                        Chatbot
                    </Link>
                </div>
            </header>

            <section className="mb-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="row g-3 align-items-end">
                            <div className="col-md-8">
                                <label htmlFor="folder-id" className="form-label">Folder ID facultatif</label>
                                <input
                                    id="folder-id"
                                    className="form-control"
                                    value={folderId}
                                    onChange={(event) => setFolderId(event.target.value)}
                                    placeholder="Filtrer un dossier Drive précis"
                                />
                            </div>
                            <div className="col-md-4 d-grid gap-2">
                                <button type="button" className="btn btn-outline-secondary" onClick={connectDrive}>
                                    Connecter Google Drive
                                </button>
                                <button type="button" className="btn btn-primary" onClick={loadFiles} disabled={loading}>
                                    {loading ? "Chargement..." : "Rafraîchir la liste"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {message && <div className="alert alert-info">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <section className="mb-3">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h2 className="h5 mb-1">Fichiers Drive</h2>
                                <p className="text-body-secondary mb-0">
                                    Les fichiers listés ici proviennent du backend KaribDocs. {count !== null ? `${count} fichier(s)` : ""}
                                </p>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Type MIME</th>
                                        <th>Taille</th>
                                        <th>Modifié</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-body-secondary">
                                                Aucun fichier Drive trouvé ou aucune connexion Google Drive active.
                                            </td>
                                        </tr>
                                    ) : (
                                        files.map((file) => (
                                            <tr key={file.id}>
                                                <td>{file.name}</td>
                                                <td>{file.mimeType}</td>
                                                <td>{file.size ?? "-"}</td>
                                                <td>{file.modifiedTime ? new Date(file.modifiedTime).toLocaleString() : "-"}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => syncFile(file.id)}
                                                        disabled={syncingFileId === file.id}
                                                    >
                                                        {syncingFileId === file.id ? "Synchronisation..." : "Synchroniser"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}