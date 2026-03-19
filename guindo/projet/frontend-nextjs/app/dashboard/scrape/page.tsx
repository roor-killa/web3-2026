"use client";

import { useEffect, useState } from "react";
import { getFastapiToken } from "@/lib/fastapi";

const FASTAPI = "http://localhost:8000/api/v1";

interface ScrapeLog {
    id: number;
    territory: string;
    pages: number;
    status: "running" | "success" | "error";
    nb_produits: number;
    message: string | null;
    started_at: string | null;
    finished_at: string | null;
}

const TERRITORIES = [
    { value: "mq", label: "🇲🇶 Martinique" },
    { value: "gp", label: "🇬🇵 Guadeloupe" },
    { value: "re", label: "🇷🇪 Réunion" },
    { value: "gf", label: "🇬🇫 Guyane" },
];

export default function DashboardScrapePage() {
    const [logs, setLogs] = useState<ScrapeLog[]>([]);
    const [territory, setTerritory] = useState("mq");
    const [pages, setPages] = useState(1);
    const [running, setRunning] = useState(false);
    const [currentLogId, setCurrentLogId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${getFastapiToken()}`,
    });

    const fetchLogs = async () => {
        const res = await fetch(`${FASTAPI}/admin/scrape/logs`, { headers: getHeaders() });
        if (res.ok) setLogs(await res.json());
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    // Polling du log en cours toutes les 3 secondes
    useEffect(() => {
        if (!running || !currentLogId) return;

        const interval = setInterval(async () => {
            const res = await fetch(`${FASTAPI}/admin/scrape/logs/${currentLogId}`, { headers: getHeaders() });
            if (res.ok) {
                const log: ScrapeLog = await res.json();
                setLogs((prev) => prev.map((l) => (l.id === log.id ? log : l)));
                if (log.status !== "running") {
                    setRunning(false);
                    setCurrentLogId(null);
                    clearInterval(interval);
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [running, currentLogId]);

    const handleRun = async () => {
        setError(null);
        setRunning(true);

        try {
            const res = await fetch(`${FASTAPI}/admin/scrape/run`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({ territory, pages }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Erreur lors du lancement");
            }

            const log: ScrapeLog = await res.json();
            setLogs((prev) => [log, ...prev]);
            setCurrentLogId(log.id);
        } catch (e: any) {
            setError(e.message);
            setRunning(false);
        }
    };

    const statusBadge = (status: string) => {
        const styles: Record<string, string> = {
            running: "bg-yellow-100 text-yellow-700 animate-pulse",
            success: "bg-green-100 text-green-700",
            error: "bg-red-100 text-red-600",
        };
        const labels: Record<string, string> = {
            running: "⏳ En cours...",
            success: "✅ Succès",
            error: "❌ Erreur",
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || ""}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Lancer un Scraping</h1>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>
            )}

            {/* Formulaire de lancement */}
            <div className="bg-white border rounded-lg p-6 mb-8">
                <h2 className="font-semibold mb-4">Nouveau scraping Kiprix</h2>
                <div className="flex gap-4 items-end">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Territoire</label>
                        <select
                            value={territory}
                            onChange={(e) => setTerritory(e.target.value)}
                            className="border rounded px-3 py-2 text-sm"
                        >
                            {TERRITORIES.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Pages</label>
                        <input
                            type="number"
                            min={1}
                            max={20}
                            value={pages}
                            onChange={(e) => setPages(Number(e.target.value))}
                            className="border rounded px-3 py-2 text-sm w-20"
                        />
                    </div>
                    <button
                        onClick={handleRun}
                        disabled={running}
                        className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {running ? "Scraping en cours..." : "▶ Lancer"}
                    </button>
                </div>
                {running && (
                    <p className="text-sm text-yellow-600 mt-3">
                        ⏳ Le scraping tourne en arrière-plan, cette page se met à jour automatiquement...
                    </p>
                )}
            </div>

            {/* Historique */}
            <div className="bg-white border rounded-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-semibold">Historique des scraping</h2>
                    <button onClick={fetchLogs} className="text-sm text-blue-500 hover:underline">
                        Rafraîchir
                    </button>
                </div>

                {logs.length === 0 ? (
                    <p className="p-4 text-gray-400 text-sm">Aucun scraping lancé pour l'instant.</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-3">Territoire</th>
                                <th className="text-left p-3">Pages</th>
                                <th className="text-left p-3">Statut</th>
                                <th className="text-left p-3">Produits</th>
                                <th className="text-left p-3">Lancé le</th>
                                <th className="text-left p-3">Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 font-medium uppercase">{log.territory}</td>
                                    <td className="p-3">{log.pages}</td>
                                    <td className="p-3">{statusBadge(log.status)}</td>
                                    <td className="p-3">{log.nb_produits}</td>
                                    <td className="p-3 text-gray-500 text-xs">
                                        {log.started_at
                                            ? new Date(log.started_at).toLocaleString("fr-FR")
                                            : "—"}
                                    </td>
                                    <td className="p-3 text-xs text-gray-400 max-w-xs truncate">
                                        {log.message || "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
