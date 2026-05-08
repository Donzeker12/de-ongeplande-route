<?php

namespace App\Http\Controllers;

use App\Models\Outing;
use Inertia\Inertia;
use Inertia\Response;

class OutingController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Outing $outing): Response
    {
        $outing->load(['discoveries', 'socialSnippets']);

        return Inertia::render('Outing/Show', [
            'outing' => [
                'id' => $outing->id,
                'title' => $outing->title,
                'slug' => $outing->slug,
                'story' => $outing->story,
                'location' => $outing->location,
                'city' => $outing->city,
                'price_info' => $outing->price_info,
                'price_details' => $outing->price_details,
                'mood' => $outing->mood,
                'featured_image' => $outing->featured_image,
                'images' => $outing->images,
                'category' => $outing->category,
                'visit_date' => $outing->visit_date?->format('d F Y'),
                'published_at' => $outing->published_at?->toIso8601String(),
                'updated_at' => $outing->updated_at?->toIso8601String(),
                'seo_description' => $outing->story
                    ? \Illuminate\Support\Str::limit(strip_tags($outing->story), 155)
                    : "Ontdek {$outing->title} in {$outing->city} – een spontaan uitje van De Ongeplande Route.",
                'discoveries' => $outing->discoveries->map(fn ($discovery) => [
                    'id' => $discovery->id,
                    'title' => $discovery->title,
                    'type' => $discovery->type,
                    'description' => $discovery->description,
                    'image' => $discovery->image,
                ]),
            ],
        ]);
    }
}
