<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScraperURL extends Model
{
    protected $table = 'scraper_urls';

    protected $fillable = [
        'url',
        'territory',
        'max_pages',
        'active',
        'last_scraped_at',
        'next_scrape_at',
        'cron_expression',
        'custom_name',
        'status'
    ];

    protected $casts = [
        'last_scraped_at' => 'datetime',
        'next_scrape_at' => 'datetime',
        'active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relation avec les résultats de scraping
     */
    public function scrapingResults()
    {
        return $this->hasMany(ScrapingResult::class);
    }

    /**
     * Vérifie si cette URL est active et doit être scrapée
     */
    public function shouldBeScrapped()
    {
        return $this->active && 
               (!$this->next_scrape_at || $this->next_scrape_at <= now());
    }

    /**
     * Met à jour le timestamp du scraping
     */
    public function markAsScrapped()
    {
        $this->last_scraped_at = now();
        // Parser l'expression cron pour obtenir la prochaine exécution
        $this->save();
    }
}
