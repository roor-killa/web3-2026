<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ScraperURL;
use App\Models\ScrapingResult;
use Illuminate\Support\Facades\Http;
use Cron\CronExpression;

class ExecuteScrapingTasks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scraper:execute';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Exécute les tâches de scraping planifiées via Cron';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🕷️ Vérification des tâches de scraping à exécuter...');

        // Récupérer toutes les URLs actives
        $urls = ScraperURL::where('active', true)->get();

        if ($urls->isEmpty()) {
            $this->warn('Aucune URL active à scraper');
            return Command::SUCCESS;
        }

        $executed = 0;
        $skipped = 0;

        foreach ($urls as $url) {
            // Vérifier si l'expression Cron doit être exécutée maintenant
            if ($this->shouldExecuteCron($url->cron_expression)) {
                $this->executeScraping($url);
                $executed++;
            } else {
                $skipped++;
            }
        }

        $this->info("✅ Exécution complétée : $executed lancés, $skipped ignorés");
        return Command::SUCCESS;
    }

    /**
     * Vérifie si une expression Cron doit être exécutée maintenant
     */
    private function shouldExecuteCron(string $cronExpression): bool
    {
        try {
            $cron = CronExpression::factory($cronExpression);
            return $cron->isDue();
        } catch (\Exception $e) {
            $this->error("Expression Cron invalide: $cronExpression");
            return false;
        }
    }

    /**
     * Lance le scraping pour une URL
     */
    private function executeScraping(ScraperURL $url)
    {
        $this->line("🚀 Lancement du scraping pour: {$url->custom_name} ({$url->territory})");

        try {
            // Appeler l'API FastAPI
            $response = Http::timeout(300) // 5 minutes
                ->post('http://kiprix_fastapi:8000/scrape', [
                    'territory' => $url->territory,
                    'max_pages' => $url->max_pages,
                    'min_delay' => 1.5,
                ]);

            /** @var \Illuminate\Http\Client\Response $response */

            if ($response->status() === 200 || $response->status() === 202) {
                $data = $response->json();
                $taskId = $data['task_id'];

                // Enregistrer le résultat en attente
                $result = ScrapingResult::startScraping($url->id, $taskId);

                // Mettre à jour le statut de l'URL
                $url->update([
                    'status' => 'running',
                    'last_scraped_at' => now(),
                ]);

                $this->info("✅ Scraping lancé : task_id=$taskId");
            } else {
                throw new \Exception('Réponse FastAPI invalide');
            }
        } catch (\Exception $e) {
            $this->error("❌ Erreur: " . $e->getMessage());

            $url->update(['status' => 'failed']);
        }
    }
}
