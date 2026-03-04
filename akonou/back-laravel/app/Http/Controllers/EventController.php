<?php

namespace App\Http\Controllers;

use App\Models\CampusEvent;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EventController extends Controller
{
    public function index()
    {
        $events = CampusEvent::with('category')
            ->orderBy('date')
            ->get();

        return response()->json([
            'data' => $events,
            'message' => 'Events retrieved successfully',
        ]);
    }

    public function show($id)
    {
        $event = CampusEvent::with(['category', 'participants'])->find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Event not found',
            ], 404);
        }

        return response()->json([
            'data' => $event,
            'message' => 'Event retrieved successfully',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date|after:now',
            'location' => 'required|string|max:255',
            'max_participants' => 'required|integer|min:1',
            'category_id' => 'required|integer|exists:event_categories,id',
        ]);

        $event = CampusEvent::create($validated);

        return response()->json([
            'data' => $event->load('category'),
            'message' => 'Event created successfully',
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $event = CampusEvent::find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Event not found',
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'date' => 'sometimes|date|after:now',
            'location' => 'sometimes|string|max:255',
            'max_participants' => 'sometimes|integer|min:1',
            'category_id' => [
                'sometimes',
                'integer',
                Rule::exists('event_categories', 'id'),
            ],
        ]);

        if (array_key_exists('max_participants', $validated)) {
            $registeredCount = $event->participants()->count();

            if ($validated['max_participants'] < $registeredCount) {
                return response()->json([
                    'message' => 'max_participants cannot be less than current registrations',
                ], 422);
            }
        }

        $event->update($validated);

        return response()->json([
            'data' => $event->load('category'),
            'message' => 'Event updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $event = CampusEvent::find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Event not found',
            ], 404);
        }

        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully',
        ]);
    }

    public function register(Request $request, $id)
    {
        $event = CampusEvent::find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Event not found',
            ], 404);
        }

        if ($event->date->isPast()) {
            return response()->json([
                'message' => 'Cannot register to a past event',
            ], 422);
        }

        $user = $request->user();

        $alreadyRegistered = $event->participants()
            ->where('user_id', $user->id)
            ->exists();

        if ($alreadyRegistered) {
            return response()->json([
                'message' => 'User is already registered for this event',
            ], 422);
        }

        $registeredCount = $event->participants()->count();
        if ($registeredCount >= $event->max_participants) {
            return response()->json([
                'message' => 'Event is full',
            ], 422);
        }

        $event->participants()->attach($user->id, [
            'registered_at' => now(),
        ]);

        return response()->json([
            'message' => 'Registration successful',
        ], 201);
    }

    public function unregister(Request $request, $id)
    {
        $event = CampusEvent::find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Event not found',
            ], 404);
        }

        $detached = $event->participants()->detach($request->user()->id);

        if ($detached === 0) {
            return response()->json([
                'message' => 'User is not registered for this event',
            ], 422);
        }

        return response()->json([
            'message' => 'Unregistration successful',
        ]);
    }

    public function myEvents(Request $request)
    {
        $events = $request->user()
            ->registeredEvents()
            ->with('category')
            ->orderBy('date')
            ->get();

        return response()->json([
            'data' => $events,
            'message' => 'Registered events retrieved successfully',
        ]);
    }
}
