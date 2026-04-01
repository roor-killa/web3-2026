<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ScraperConfiguration;
use App\Models\ScraperSchedule;

class ScraperConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Configurations par défaut
        $configs = [
            [
                'key' => 'default_territory',
                'value' => 'gp',
                'type' => 'string',
                'description' => 'Territoire par défaut pour les scrapings',
            ],
            [
                'key' => 'default_max_pages',
                'value' => '10',
                'type' => 'integer',
                'description' => 'Nombre de pages par défaut à scraper',
            ],
            [
                'key' => 'default_delay',
                'value' => '1.5',
                'type' => 'string',
                'description' => 'Délai minimum entre les requêtes (en secondes)',
            ],
            [
                'key' => 'retry_attempts',
                'value' => '3',
                'type' => 'integer',
                'description' => 'Nombre de tentatives en cas d\'erreur',
            ],
            [
                'key' => 'timeout_seconds',
                'value' => '30',
                'type' => 'integer',
                'description' => 'Timeout pour chaque requête (en secondes)',
            ],
            [
                'key' => 'notify_on_complete',
                'value' => 'false',
                'type' => 'boolean',
                'description' => 'Envoyer une notification à la fin du scraping',
            ],
            [
                'key' => 'scraper_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'description' => 'État global du scraper',
            ],
        ];

        foreach ($configs as $config) {
            ScraperConfiguration::updateOrCreate(
                ['key' => $config['key']],
                $config
            );
        }

        // Planification par défaut
        ScraperSchedule::updateOrCreate(
            ['cron_expression' => '0 2 * * *'],
            [
                'name' => 'Scraping quotidien - Guadeloupe',
                'territories' => ['gp'],
                'max_pages' => 10,
                'enabled' => false,
                'next_execution_at' => now()->addDay(),
            ]
        );

        $this->command->info('✓ Configurations du scraper initialisées');
    }
}
