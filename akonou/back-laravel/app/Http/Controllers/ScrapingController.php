<?php

namespace App\Http\Controllers;

use App\Models\ScraperURL;
use App\Models\ScrapingResult;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class ScrapingController extends Controller
{
    /**
     * Récupère l'état d'une tâche de scraping
     */
    public function taskStatus(string $taskId): JsonResponse
    {
        $result = ScrapingResult::where('task_id', $taskId)->firstOrFail();

        return response()->json([
            'task_id' => $result->task_id,
            'status' => $result->status,
            'total_products' => $result->total_products,
            'pages_scraped' => $result->pages_scraped,
            'started_at' => $result->started_at,
            'completed_at' => $result->completed_at,
            'error' => $result->error_message,
        ]);
    }

    /**
     * Lance un scraping immédiat via l'API FastAPI
     */
    public function launchImmediate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'scraper_url_id' => 'required|exists:scraper_urls,id',
        ]);

        $url = ScraperURL::findOrFail($validated['scraper_url_id']);

        // Appeler l'API FastAPI
        try {
            $response = Http::post('http://kiprix_fastapi:8000/scrape', [
                'territory' => $url->territory,
                'max_pages' => $url->max_pages,
                'min_delay' => 1.5,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $taskId = $data['task_id'];

                // Enregistrer le résultat en attente
                $result = ScrapingResult::startScraping($url->id, $taskId);

                return response()->json([
                    'message' => 'Scraping lancé',
                    'task_id' => $taskId,
                    'result_id' => $result->id,
                ], 202);
            } else {
                throw new \Exception('Erreur FastAPI: ' . $response->body());
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Impossible de lancer le scraping: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupère tous les logs de scraping
     */
    public function logs(Request $request): JsonResponse
    {
        $lines = $request->query('lines', 100);

        try {
            $response = Http::get("http://kiprix_fastapi:8000/logs?lines=$lines");

            if ($response->successful()) {
                return response()->json($response->json());
            }
        } catch (\Exception $e) {
            // Fallback: récupérer localement
        }

        return response()->json([
            'logs' => [],
            'message' => 'Logs non disponibles'
        ]);
    }

    /**
     * Récupère les statistiques globales du scraping
     */
    public function globalStats(): JsonResponse
    {
        $stats = [
            'total_urls' => ScraperURL::count(),
            'active_urls' => ScraperURL::where('active', true)->count(),
            'total_scrapings' => ScrapingResult::count(),
            'successful_scrapings' => ScrapingResult::where('status', 'completed')->count(),
            'failed_scrapings' => ScrapingResult::where('status', 'failed')->count(),
            'total_products' => ScrapingResult::sum('total_products') ?? 0,
            'territories' => ScraperURL::select('territory')->distinct()->pluck('territory'),
            
            // Derniers scrapings
            'recent_scrapings' => ScrapingResult::with('scraperUrl')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(),
        ];

        return response()->json($stats);
    }
}
