<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventRegistration extends Model
{
    protected $fillable = [
        'user_id',
        'event_id',
    ];

    // Relation: une inscription appartient à un User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relation: une inscription appartient à un Event
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
