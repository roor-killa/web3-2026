<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScraperSchedule extends Model
{
    protected $table = 'scraper_schedules';
    protected $fillable = [
        'cron_expression',
        'name',
        'territories',
        'max_pages',
        'enabled',
        'last_executed_at',
        'next_execution_at'
    ];

    protected $casts = [
        'territories' => 'array',
        'enabled' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'last_executed_at' => 'datetime',
        'next_execution_at' => 'datetime',
    ];

    /**
     * Récupère toutes les planifications actives
     */
    public static function getActiveSchedules()
    {
        return self::where('enabled', true)->get();
    }

    /**
     * Marque une planification comme exécutée
     */
    public function markAsExecuted($nextExecutionTime = null)
    {
        $this->update([
            'last_executed_at' => now(),
            'next_execution_at' => $nextExecutionTime ?? now()->addDay(),
        ]);
        return $this;
    }
}
