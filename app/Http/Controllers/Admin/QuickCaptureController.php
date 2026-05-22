<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Discovery;
use App\Models\Outing;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class QuickCaptureController extends Controller
{
    public function index(): Response
    {
        $venues = Venue::orderBy('name')->get(['id', 'name', 'type', 'city']);
        $recentOutings = Outing::with('venue')
            ->where('published_at', null) // Draft outings
            ->orWhere('published_at', '>', now()->subDays(30)) // Recent published
            ->latest()
            ->limit(10)
            ->get(['id', 'title', 'city', 'venue_id', 'visit_date']);

        return Inertia::render('Admin/QuickCapture', [
            'venues' => $venues,
            'recentOutings' => $recentOutings,
            'discoveryTypes' => [
                'dier' => '🐾 Dier',
                'plek' => '📍 Plek', 
                'weetje' => '💡 Weetje',
                'eten' => '🍽️ Eten & Drinken',
                'activiteit' => '🎯 Activiteit',
                'tip' => '✨ Tip',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|string',
            'image' => 'nullable|image|max:10240', // 10MB
            'venue_id' => 'nullable|exists:venues,id',
            'outing_id' => 'nullable|exists:outings,id',
            'create_new_outing' => 'nullable|boolean',
            'new_outing_title' => 'required_if:create_new_outing,true|string|max:255',
            'location_note' => 'nullable|string|max:255',
        ]);

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('discoveries', 'public');
        }

        // Determine or create outing
        $outingId = null;
        
        if ($validated['create_new_outing'] ?? false) {
            // Create new draft outing
            $venue = Venue::find($validated['venue_id']);
            $outing = Outing::create([
                'title' => $validated['new_outing_title'],
                'slug' => Str::slug($validated['new_outing_title']),
                'story' => 'Een spontaan uitje waar we van alles hebben ontdekt!',
                'city' => $venue?->city ?? ($validated['location_note'] ?? 'Onbekend'),
                'venue_id' => $validated['venue_id'],
                'visit_date' => now()->format('Y-m-d'),
                'is_recommended' => false,
                'is_free' => false,
                // published_at remains null (draft)
            ]);
            $outingId = $outing->id;
        } else {
            $outingId = $validated['outing_id'];
        }

        // Create discovery
        $discovery = Discovery::create([
            'outing_id' => $outingId,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'image' => $imagePath,
        ]);

        return redirect()->back()->with('success', 'Ontdekking succesvol vastgelegd! 📸');
    }

    public function getLocationSuggestions(Request $request)
    {
        $search = $request->get('search', '');
        
        if (strlen($search) < 2) {
            return response()->json([]);
        }

        $venues = Venue::where('name', 'like', "%{$search}%")
            ->orWhere('city', 'like', "%{$search}%")
            ->orderBy('name')
            ->limit(10)
            ->get(['id', 'name', 'type', 'city']);

        return response()->json($venues);
    }
}