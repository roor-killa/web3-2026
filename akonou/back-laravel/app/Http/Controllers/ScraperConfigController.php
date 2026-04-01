<?php

namespace App\Http\Controllers;

use App\Models\ScraperConfiguration;
use App\Models\ScraperSchedule;
use App\Models\ScraperExecutionLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ScraperConfigController extends Controller
{
    /**
     * Récupère toutes les configurations
     */
    public function getAllConfigs(): JsonResponse
    {
        try {
            $configs = ScraperConfiguration::all();
            
            // Transformer avec les valeurs typées
            $formatted = $configs->mapWithKeys(function ($config) {
                return [$config->key => [
                    'value' => $config->getTypedValue(),
                    'type' => $config->type,
                    'description' => $config->description,
                ]];
            });
            
            return response()->json([
                'success' => true,
                'data' => $formatted,
                'count' => $configs->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des configurations',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Récupère une configuration spécifique
     */
    public function getConfig(string $key): JsonResponse
    {
        try {
            $config = ScraperConfiguration::where('key', $key)->first();
            
            if (!$config) {
                return response()->json([
                    'success' => false,
                    'message' => "Configuration '{$key}' non trouvée",
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'key' => $config->key,
                    'value' => $config->getTypedValue(),
                    'type' => $config->type,
                    'description' => $config->description,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la configuration',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Crée ou met à jour une configuration
     */
    public function saveConfig(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'key' => 'required|string',
                'value' => 'required',
                'type' => 'nullable|string|in:string,integer,boolean,json',
                'description' => 'nullable|string',
            ]);

            $config = ScraperConfiguration::setConfig(
                $validated['key'],
                $validated['value'],
                $validated['type'] ?? 'string',
                $validated['description'] ?? null
            );

            return response()->json([
                'success' => true,
                'message' => 'Configuration sauvegardée',
                'data' => [
                    'key' => $config->key,
                    'value' => $config->getTypedValue(),
                    'type' => $config->type,
                ],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la sauvegarde',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Supprime une configuration
     */
    public function deleteConfig(string $key): JsonResponse
    {
        try {
            $deleted = ScraperConfiguration::where('key', $key)->delete();
            
            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => "Configuration '{$key}' non trouvée",
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Configuration supprimée',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Récupère tous les horaires
     */
    public function getAllSchedules(): JsonResponse
    {
        try {
            $schedules = ScraperSchedule::all();
            
            return response()->json([
                'success' => true,
                'data' => $schedules,
                'count' => $schedules->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des horaires',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Crée ou met à jour un horaire
     */
    public function saveSchedule(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'cron_expression' => 'required|string',
                'name' => 'nullable|string',
                'territories' => 'required|array',
                'territories.*' => 'string|in:gp,mq,re,gf',
                'max_pages' => 'nullable|integer|min:1',
                'enabled' => 'nullable|boolean',
            ]);

            $schedule = ScraperSchedule::updateOrCreate(
                ['cron_expression' => $validated['cron_expression']],
                [
                    'name' => $validated['name'] ?? null,
                    'territories' => $validated['territories'],
                    'max_pages' => $validated['max_pages'] ?? 10,
                    'enabled' => $validated['enabled'] ?? true,
                    'next_execution_at' => now()->addDay(),
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Horaire sauvegardé',
                'data' => $schedule,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la sauvegarde',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Supprime un horaire
     */
    public function deleteSchedule($id): JsonResponse
    {
        try {
            $schedule = ScraperSchedule::find($id);
            
            if (!$schedule) {
                return response()->json([
                    'success' => false,
                    'message' => 'Horaire non trouvé',
                ], 404);
            }

            $schedule->delete();

            return response()->json([
                'success' => true,
                'message' => 'Horaire supprimé',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Récupère l'historique des exécutions
     */
    public function getExecutionHistory(Request $request): JsonResponse
    {
        try {
            $limit = $request->get('limit', 50);
            $territory = $request->get('territory');
            $status = $request->get('status');

            $query = ScraperExecutionLog::orderBy('created_at', 'desc');

            if ($territory) {
                $query->where('territory', $territory);
            }

            if ($status) {
                $query->where('status', $status);
            }

            $logs = $query->limit($limit)->get();

            return response()->json([
                'success' => true,
                'data' => $logs,
                'count' => $logs->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de l\'historique',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Vérifie la santé du système de scraping
     */
    public function getSystemHealth(): JsonResponse
    {
        try {
            $recentLogs = ScraperExecutionLog::orderBy('created_at', 'desc')
                ->limit(10)
                ->get();

            $completedCount = $recentLogs->where('status', 'completed')->count();
            $failedCount = $recentLogs->where('status', 'failed')->count();

            return response()->json([
                'success' => true,
                'health' => $failedCount === 0 ? 'healthy' : 'degraded',
                'stats' => [
                    'recent_executions' => $recentLogs->count(),
                    'completed' => $completedCount,
                    'failed' => $failedCount,
                    'success_rate' => $recentLogs->count() > 0 ? 
                        round(($completedCount / $recentLogs->count()) * 100, 2) : 0,
                ],
                'last_execution' => $recentLogs->first(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la vérification de la santé',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
