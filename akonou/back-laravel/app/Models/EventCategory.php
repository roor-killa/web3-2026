<?php

namespace App\Models;

use App\Models\CampusEvent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EventCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function events(): HasMany
    {
        return $this->hasMany(CampusEvent::class, 'category_id');
    }
}
