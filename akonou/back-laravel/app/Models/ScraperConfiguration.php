<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScraperConfiguration extends Model
{
    protected $table = 'scraper_configurations';
    protected $fillable = ['key', 'value', 'type', 'description'];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Récupère la valeur typée
     */
    public function getTypedValue()
    {
        return match ($this->type) {
            'integer' => (int) $this->value,
            'boolean' => $this->value === 'true' || $this->value === '1',
            'json' => json_decode($this->value, true),
            default => $this->value,
        };
    }

    /**
     * Récupère une configuration par clé
     */
    public static function getConfig(string $key, $default = null)
    {
        $config = self::where('key', $key)->first();
        return $config ? $config->getTypedValue() : $default;
    }

    /**
     * Définit une configuration
     */
    public static function setConfig(string $key, $value, string $type = 'string', $description = null)
    {
        return self::updateOrCreate(
            ['key' => $key],
            [
                'value' => is_array($value) ? json_encode($value) : (string) $value,
                'type' => $type,
                'description' => $description,
            ]
        );
    }
}
