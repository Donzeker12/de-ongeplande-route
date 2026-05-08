<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class VenueController extends Controller
{
    public function index(): Response
    {
        $venues = Venue::query()
            ->orderBy('name')
            ->get()
            ->map(fn (Venue $venue) => [
                'id' => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
                'type' => $venue->type,
                'type_label' => $venue->type_label,
                'type_emoji' => $venue->type_emoji,
                'description' => $venue->description,
                'city' => $venue->city,
                'country' => $venue->country,
                'featured_image' => $venue->featured_image,
            ]);

        return Inertia::render('Venue/Index', [
            'venues' => $venues,
            'types' => Venue::$types,
        ]);
    }

    public function show(Venue $venue): Response
    {
        $seoDescription = $venue->description
            ? Str::limit(strip_tags($venue->description), 155)
            : "Ontdek {$venue->name} in {$venue->city} – een {$venue->type_label} voor het hele gezin via De Ongeplande Route.";

        return Inertia::render('Venue/Show', [
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
                'type' => $venue->type,
                'type_label' => $venue->type_label,
                'type_emoji' => $venue->type_emoji,
                'description' => $venue->description,
                'city' => $venue->city,
                'country' => $venue->country,
                'address' => $venue->address,
                'website' => $venue->website,
                'featured_image' => $venue->featured_image,
                'opening_hours' => $venue->opening_hours,
                'prices' => $venue->prices,
                'highlights' => $venue->highlights,
                'accessibility_transport' => $venue->accessibility_transport,
                'accessibility_facilities' => $venue->accessibility_facilities,
                'seo_description' => $seoDescription,
                'updated_at' => $venue->updated_at?->toIso8601String(),
            ],
        ]);
    }
}
