<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * GET /api/events
     * Lister tous les événements (utilisateurs connectés)
     */
    public function index()
    {
        $events = Event::withCount('registrations')
                       ->orderBy('event_date')
                       ->get()
                       ->map(function ($event) {
                           $event->is_full = $event->registrations_count >= $event->max_participants;
                           return $event;
                       });

        return response()->json($events);
    }

    /**
     * GET /api/events/{id}
     * Détails d'un événement
     */
    public function show($id)
    {
        $event = Event::withCount('registrations')->findOrFail($id);
        $event->is_full = $event->registrations_count >= $event->max_participants;

        return response()->json($event);
    }

    /**
     * POST /api/events
     * Créer un événement (admin uniquement)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'description'      => 'nullable|string',
            'location'         => 'nullable|string|max:255',
            'event_date'       => 'required|date|after:now',
            'max_participants' => 'required|integer|min:1',
        ]);

        $event = Event::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($event, 201);
    }

    /**
     * PUT /api/events/{id}
     * Modifier un événement (admin uniquement)
     */
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'title'            => 'sometimes|string|max:255',
            'description'      => 'nullable|string',
            'location'         => 'nullable|string|max:255',
            'event_date'       => 'sometimes|date|after:now',
            'max_participants' => 'sometimes|integer|min:1',
        ]);

        $event->update($validated);

        return response()->json($event);
    }

    /**
     * DELETE /api/events/{id}
     * Supprimer un événement (admin uniquement)
     */
    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return response()->json(['message' => 'Événement supprimé']);
    }

    /**
     * POST /api/events/{id}/register
     * S'inscrire à un événement
     */
    public function register(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $user  = $request->user();

        // L'événement doit être dans le futur
        if ($event->event_date->isPast()) {
            return response()->json(['message' => "Impossible de s'inscrire à un événement passé"], 422);
        }

        // Vérifier si déjà inscrit
        $alreadyRegistered = EventRegistration::where('user_id', $user->id)
                                              ->where('event_id', $event->id)
                                              ->exists();
        if ($alreadyRegistered) {
            return response()->json(['message' => 'Vous êtes déjà inscrit à cet événement'], 422);
        }

        // Vérifier que l'événement n'est pas complet
        if ($event->isFull()) {
            return response()->json(['message' => "L'événement est complet"], 422);
        }

        EventRegistration::create([
            'user_id'  => $user->id,
            'event_id' => $event->id,
        ]);

        return response()->json(['message' => 'Inscription réussie'], 201);
    }

    /**
     * DELETE /api/events/{id}/unregister
     * Se désinscrire d'un événement
     */
    public function unregister(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $user  = $request->user();

        $registration = EventRegistration::where('user_id', $user->id)
                                         ->where('event_id', $event->id)
                                         ->first();

        if (!$registration) {
            return response()->json(['message' => "Vous n'êtes pas inscrit à cet événement"], 404);
        }

        $registration->delete();

        return response()->json(['message' => 'Désinscription réussie']);
    }

    /**
     * GET /api/my-events
     * Voir ses propres inscriptions
     */
    public function myEvents(Request $request)
    {
        $events = $request->user()
                          ->events()
                          ->orderBy('event_date')
                          ->get();

        return response()->json($events);
    }
}
