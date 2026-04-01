<?php

namespace App\Http\Controllers;

use App\Models\ScraperConfiguration;
use App\Models\ScraperSchedule;
use App\Models\ScraperExecutionLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    /**
     * Process chatbot questions about scraper
     */
    public function chat(Request $request): JsonResponse
    {
        try {
            $question = strtolower(trim($request->input('question', '')));
            
            if (empty($question)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please ask a question',
                    'response' => 'Je suis ici pour vous aider ! Posez-moi une question sur le scraper.',
                ], 400);
            }

            // Get scraper data
            $health = $this->getHealthData();
            $configs = ScraperConfiguration::all();
            $schedules = ScraperSchedule::all();
            $recentLogs = ScraperExecutionLog::orderBy('created_at', 'desc')->limit(10)->get();

            // Generate response based on question
            $response = $this->generateResponse($question, $health, $configs, $schedules, $recentLogs);

            return response()->json([
                'success' => true,
                'question' => $question,
                'response' => $response,
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error processing question',
                'error' => $e->getMessage(),
                'response' => 'Désolé, une erreur est survenue lors du traitement de votre question.',
            ], 500);
        }
    }

    /**
     * Generate intelligent response based on question
     */
    private function generateResponse($question, $health, $configs, $schedules, $recentLogs): string
    {
        $responses = [];

        // Health & Status questions
        if ($this->matchesKeywords($question, ['santé', 'health', 'status', 'statut', 'ça va'])) {
            $responses[] = $this->respondToHealth($health);
        }

        // Configuration questions
        if ($this->matchesKeywords($question, ['config', 'configuration', 'paramètre', 'setting', 'défini'])) {
            $responses[] = $this->respondToConfig($configs);
        }

        // Schedule questions
        if ($this->matchesKeywords($question, ['horaire', 'schedule', 'cron', 'timing', 'quand'])) {
            $responses[] = $this->respondToSchedules($schedules);
        }

        // History & Performance questions
        if ($this->matchesKeywords($question, ['historique', 'history', 'exécution', 'execution', 'dernier', 'last'])) {
            $responses[] = $this->respondToHistory($recentLogs);
        }

        // Territory questions
        if ($this->matchesKeywords($question, ['territoire', 'territory', 'gp', 'mq', 're', 'gf', 'guadeloupe', 'martinique'])) {
            $responses[] = $this->respondToTerritories($recentLogs, $configs);
        }

        // Help & General questions
        if ($this->matchesKeywords($question, ['aide', 'help', 'comment', 'how', 'pouvez', 'can you', 'quoi'])) {
            $responses[] = $this->getHelpText();
        }

        // If no specific match, provide general status
        if (empty($responses)) {
            $responses[] = $this->getGeneralStatus($health, $schedules, $recentLogs);
        }

        return implode("\n\n", array_filter($responses));
    }

    /**
     * Check if question contains keywords
     */
    private function matchesKeywords($question, $keywords): bool
    {
        foreach ($keywords as $keyword) {
            if (strpos($question, strtolower($keyword)) !== false) {
                return true;
            }
        }
        return false;
    }

    /**
     * Respond to health questions
     */
    private function respondToHealth($health): string
    {
        $status = $health['health'] ?? 'unknown';
        $stats = $health['stats'] ?? [];
        $lastExecution = $health['last_execution'];

        $response = "🏥 **État du Système**:\n";
        $response .= "Status: " . ($status === 'healthy' ? '✅ Sain' : '⚠️ Dégradé') . "\n";
        $response .= "Exécutions récentes: " . ($stats['recent_executions'] ?? 0) . "\n";
        $response .= "Réussites: " . ($stats['completed'] ?? 0) . "\n";
        $response .= "Échecs: " . ($stats['failed'] ?? 0) . "\n";
        $response .= "Taux de succès: " . ($stats['success_rate'] ?? 0) . "%";

        if ($lastExecution) {
            $response .= "\n\nDernière exécution: " . ($lastExecution->status ?? 'N/A');
        }

        return $response;
    }

    /**
     * Respond to configuration questions
     */
    private function respondToConfig($configs): string
    {
        if ($configs->count() === 0) {
            return "⚙️ **Configuration**: Aucune configuration définie pour le moment.";
        }

        $response = "⚙️ **Configurations Actuelles**:\n\n";
        foreach ($configs as $config) {
            $response .= "• **{$config->key}**: {$config->value}\n";
            if ($config->description) {
                $response .= "  ℹ️ {$config->description}\n";
            }
        }

        return $response;
    }

    /**
     * Respond to schedule questions
     */
    private function respondToSchedules($schedules): string
    {
        if ($schedules->count() === 0) {
            return "⏰ **Horaires**: Aucun horaire planifié pour le moment.";
        }

        $response = "⏰ **Horaires Planifiés**:\n\n";
        foreach ($schedules as $schedule) {
            $status = $schedule->enabled ? '✅' : '❌';
            $response .= "{$status} **{$schedule->name ?? $schedule->cron_expression}**\n";
            $response .= "Cron: `{$schedule->cron_expression}`\n";
            $response .= "Territoires: " . implode(', ', $schedule->territories) . "\n";
            $response .= "Pages max: {$schedule->max_pages}\n\n";
        }

        return $response;
    }

    /**
     * Respond to history questions
     */
    private function respondToHistory($logs): string
    {
        if ($logs->count() === 0) {
            return "📝 **Historique**: Aucune exécution enregistrée.";
        }

        $response = "📝 **Dernières Exécutions**:\n\n";
        foreach ($logs->take(5) as $log) {
            $status = $log->status === 'completed' ? '✅' : '❌';
            $response .= "{$status} **{$log->territory}** - {$log->status}\n";
            $response .= "Produits: {$log->total_products} | Temps: " . ($log->duration_seconds ?? 'N/A') . "s\n";
            if ($log->error_message) {
                $response .= "Erreur: {$log->error_message}\n";
            }
            $response .= "\n";
        }

        return $response;
    }

    /**
     * Respond to territory questions
     */
    private function respondToTerritories($logs, $configs): string
    {
        $territories = ['gp' => 'Guadeloupe', 'mq' => 'Martinique', 're' => 'Réunion', 'gf' => 'Guyane Française'];
        
        $response = "🗺️ **Territoires**:\n\n";
        
        foreach ($territories as $code => $name) {
            $territoryLogs = $logs->where('territory', $code);
            $completed = $territoryLogs->where('status', 'completed')->count();
            $failed = $territoryLogs->where('status', 'failed')->count();
            
            $status = $failed === 0 && $completed > 0 ? '✅' : ($failed > 0 ? '⚠️' : '⏳');
            $response .= "{$status} **{$name}** ({$code}): {$completed} réussites, {$failed} échecs\n";
        }

        return $response;
    }

    /**
     * Get help text
     */
    private function getHelpText(): string
    {
        return "🤖 **Aide du Chatbot**:\n\n" .
               "Je peux vous aider à:\n" .
               "• Vérifier la **santé du système** (dites 'santé')\n" .
               "• Voir les **configurations** (dites 'config')\n" .
               "• Consulter les **horaires** (dites 'horaires')\n" .
               "• Vérifier l'**historique** (dites 'historique')\n" .
               "• Connaître le statut des **territoires** (dites 'territoires')\n" .
               "• Voir l'**état général** (dites 'statut')\n\n" .
               "Posez vos questions naturellement en français ou en anglais!";
    }

    /**
     * Get general status response
     */
    private function getGeneralStatus($health, $schedules, $logs): string
    {
        $response = "📊 **Aperçu Général du Scraper**:\n\n";
        
        $response .= "**Santé du Système**: " . ($health['health'] === 'healthy' ? '✅ Sain' : '⚠️ Dégradé') . "\n";
        $response .= "**Horaires Actifs**: " . $schedules->where('enabled', true)->count() . "\n";
        $response .= "**Total Exécutions**: " . $logs->count() . "\n";
        
        if ($logs->count() > 0) {
            $lastLog = $logs->first();
            $response .= "**Dernière Exécution**: " . $lastLog->created_at->diffForHumans() . "\n";
        }

        return $response;
    }

    /**
     * Get health data
     */
    private function getHealthData(): array
    {
        $recentLogs = ScraperExecutionLog::orderBy('created_at', 'desc')->limit(10)->get();
        $completedCount = $recentLogs->where('status', 'completed')->count();
        $failedCount = $recentLogs->where('status', 'failed')->count();

        return [
            'health' => $failedCount === 0 ? 'healthy' : 'degraded',
            'stats' => [
                'recent_executions' => $recentLogs->count(),
                'completed' => $completedCount,
                'failed' => $failedCount,
                'success_rate' => $recentLogs->count() > 0 ? 
                    round(($completedCount / $recentLogs->count()) * 100, 2) : 0,
            ],
            'last_execution' => $recentLogs->first(),
        ];
    }
}
