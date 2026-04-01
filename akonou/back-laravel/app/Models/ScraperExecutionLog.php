<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScraperExecutionLog extends Model
{
    protected $table = 'scraper_execution_logs';
    protected $fillable = [
        'task_id',
        'status',
        'territory',
        'pages_scraped',
        'total_products',
        'error_message',
        'started_at',
        'completed_at',
        'duration_seconds',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Crée un nouveau log d'exécution
     */
    public static function createFromTask($taskData)
    {
        return self::create([
            'task_id' => $taskData['task_id'],
            'status' => $taskData['status'],
            'territory' => $taskData['territory'],
            'pages_scraped' => $taskData['pages_scraped'] ?? 0,
            'total_products' => $taskData['total_products'] ?? 0,
            'error_message' => $taskData['error'] ?? null,
            'started_at' => $taskData['started_at'],
            'completed_at' => $taskData['completed_at'] ?? null,
        ]);
    }

    /**
     * Récupère les logs récents
     */
    public static function getRecentLogs($limit = 50)
    {
        return self::orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Statistiques par territoire
     */
    public static function getStatsByTerritory($territory)
    {
        return self::where('territory', $territory)
            ->where('status', 'completed')
            ->latest('completed_at')
            ->limit(10)
            ->get();
    }
}
