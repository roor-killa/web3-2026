<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScrapingResult extends Model
{
    protected $table = 'scraping_results';

    protected $fillable = [
        'scraper_url_id',
        'task_id',
        'status',
        'total_products',
        'pages_scraped',
        'error_message',
        'started_at',
        'completed_at',
        'data_file_path'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relation avec ScraperURL
     */
    public function scraperUrl()
    {
        return $this->belongsTo(ScraperURL::class);
    }

    /**
     * Enregistre un scraping en cours
     */
    public static function startScraping($urlId, $taskId)
    {
        return self::create([
            'scraper_url_id' => $urlId,
            'task_id' => $taskId,
            'status' => 'running',
            'started_at' => now(),
        ]);
    }

    /**
     * Marque un scraping comme complété
     */
    public function markAsCompleted($totalProducts, $pagesScraped, $dataFilePath = null)
    {
        $this->update([
            'status' => 'completed',
            'total_products' => $totalProducts,
            'pages_scraped' => $pagesScraped,
            'completed_at' => now(),
            'data_file_path' => $dataFilePath,
        ]);
    }

    /**
     * Marque un scraping comme échoué
     */
    public function markAsFailed($error)
    {
        $this->update([
            'status' => 'failed',
            'error_message' => $error,
            'completed_at' => now(),
        ]);
    }
}
