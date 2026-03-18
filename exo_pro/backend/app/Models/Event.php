<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'location',
        'event_date',
        'max_participants',
        'user_id', // créateur de l'événement
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'datetime',
        ];
    }

    // Relation: un Event appartient à un User (créateur)
    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relation: un Event a plusieurs inscriptions
    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    // Relation: participants inscrits
    public function participants()
    {
        return $this->belongsToMany(User::class, 'event_registrations')
                    ->withTimestamps();
    }

    // Vérifie si l'événement est complet
    public function isFull(): bool
    {
        return $this->registrations()->count() >= $this->max_participants;
    }
}
