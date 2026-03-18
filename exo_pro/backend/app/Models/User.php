<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_admin'          => 'boolean',
        ];
    }

    // Relation: un User peut avoir plusieurs inscriptions à des événements
    public function eventRegistrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    // Relation: événements auxquels l'utilisateur est inscrit
    public function events()
    {
        return $this->belongsToMany(Event::class, 'event_registrations')
                    ->withTimestamps();
    }
}


