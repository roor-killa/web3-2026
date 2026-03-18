<?php

namespace App\Http\Controllers;

use App\Models\ScraperURL;
use App\Models\ScrapingResult;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ScraperURLController extends Controller
{
    /**
     * Liste toutes les URLs de scraping
     */
    public function index(): JsonResponse
    {
        $urls = ScraperURL::with('scrapingResults')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $urls,
            'total' => $urls->count(),
            'territories' => ['gp' => 'Guadeloupe', 'mq' => 'Martinique', 're' => 'La Réunion', 'gf' => 'Guyane']
        ]);
    }

    /**
     * Ajoute une nouvelle URL à scraper
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'url' => 'required|url|unique:scraper_urls',
            'territory' => 'required|in:gp,mq,re,gf',
            'max_pages' => 'integer|min:1|max:100',
            'custom_name' => 'nullable|string|max:255',
            'cron_expression' => 'nullable|string', // ex: "0 2 * * *"
            'active' => 'boolean',
        ]);

        $url = ScraperURL::create($validated + [
            'active' => $validated['active'] ?? true,
            'cron_expression' => $validated['cron_expression'] ?? '0 2 * * *',
            'max_pages' => $validated['max_pages'] ?? 10,
        ]);

        return response()->json([
            'message' => 'URL ajoutée avec succès',
            'data' => $url
        ], 201);
    }

    /**
     * Détails d'une URL
     */
    public function show(ScraperURL $scraperUrl): JsonResponse
    {
        $scraperUrl->load('scrapingResults');
        return response()->json($scraperUrl);
    }

    /**
     * Met à jour une URL
     */
    public function update(Request $request, ScraperURL $scraperUrl): JsonResponse
    {
        $validated = $request->validate([
            'custom_name' => 'nullable|string|max:255',
            'cron_expression' => 'nullable|string',
            'max_pages' => 'integer|min:1|max:100',
            'active' => 'boolean',
        ]);

        $scraperUrl->update($validated);

        return response()->json([
            'message' => 'URL mise à jour',
            'data' => $scraperUrl
        ]);
    }

    /**
     * Supprime une URL
     */
    public function destroy(ScraperURL $scraperUrl): JsonResponse
    {
        $scraperUrl->delete();

        return response()->json([
            'message' => 'URL supprimée'
        ]);
    }

    /**
     * Active/Désactive une URL
     */
    public function toggle(ScraperURL $scraperUrl): JsonResponse
    {
        $scraperUrl->update(['active' => !$scraperUrl->active]);

        return response()->json([
            'message' => 'Statut mis à jour',
            'data' => $scraperUrl
        ]);
    }

    /**
     * Obtient les statistiques d'une URL
     */
    public function statistics(ScraperURL $scraperUrl): JsonResponse
    {
        $results = $scraperUrl->scrapingResults()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $stats = [
            'total_scrapings' => $scraperUrl->scrapingResults()->count(),
            'successful' => $scraperUrl->scrapingResults()->where('status', 'completed')->count(),
            'failed' => $scraperUrl->scrapingResults()->where('status', 'failed')->count(),
            'total_products' => $scraperUrl->scrapingResults()->sum('total_products'),
            'last_scraped' => $scraperUrl->last_scraped_at,
            'recent_results' => $results
        ];

        return response()->json($stats);
    }
}
