<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        /**
         * Exécute les tâches de scraping toutes les minutes
         * (le système Cron interne de chaque URL détermine si elle doit réellement s'exécuter)
         */
        $schedule->command('scraper:execute')
            ->everyMinute()
            ->withoutOverlapping()
            ->onFailure(function () {
                \Illuminate\Support\Facades\Log::error('Scraper task failed at ' . now());
            })
            ->onSuccess(function () {
                \Illuminate\Support\Facades\Log::info('Scraper task executed at ' . now());
            });

        /**
         * Nettoie les résultats de scraping anciens (plus de 30 jours)
         */
        $schedule->command('scraper:cleanup')
            ->daily()
            ->at('03:00');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
