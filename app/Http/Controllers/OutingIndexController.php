<?php

namespace App\Http\Controllers;

use App\Models\Outing;
use Inertia\Inertia;
use Inertia\Response;

class OutingIndexController extends Controller
{
    public function __invoke(): Response
    {
        $outings = Outing::query()
            ->whereNotNull('published_at')
            ->orderByDesc('visit_date')
            ->get()
            ->map(fn (Outing $outing) => [
                'id' => $outing->id,
                'title' => $outing->title,
                'slug' => $outing->slug,
                'city' => $outing->city,
                'mood' => $outing->mood,
                'price_info' => $outing->price_info,
                'is_free' => $outing->is_free,
                'featured_image' => $outing->featured_image,
                'visit_date' => $outing->visit_date?->format('d F Y'),
                'published_at' => $outing->published_at?->toIso8601String(),
            ]);

        return Inertia::render('Outing/Index', [
            'outings' => $outings,
        ]);
    }
}
