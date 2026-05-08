<?php

namespace App\Http\Controllers;

use App\Models\Discovery;
use App\Models\Outing;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        $category = $request->query('category');

        $outingsQuery = Outing::query()
            ->whereNotNull('published_at')
            ->with('discoveries');

        if ($category) {
            $outingsQuery->where('category', $category);
        }

        $categories = Outing::query()
            ->whereNotNull('published_at')
            ->whereNotNull('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');

        return Inertia::render('Home', [
            'latestOutings' => (clone $outingsQuery)
                ->latest('published_at')
                ->take(6)
                ->get()
                ->map(fn ($outing) => [
                    'id' => $outing->id,
                    'title' => $outing->title,
                    'slug' => $outing->slug,
                    'city' => $outing->city,
                    'price_info' => $outing->price_info,
                    'featured_image' => $outing->featured_image,
                    'category' => $outing->category,
                    'discoveries_count' => $outing->discoveries->count(),
                ]),

            'recommendedOutings' => Outing::query()
                ->whereNotNull('published_at')
                ->where('is_recommended', true)
                ->with('discoveries')
                ->latest('published_at')
                ->take(3)
                ->get()
                ->map(fn ($outing) => [
                    'id' => $outing->id,
                    'title' => $outing->title,
                    'slug' => $outing->slug,
                    'city' => $outing->city,
                    'price_info' => $outing->price_info,
                    'featured_image' => $outing->featured_image,
                    'category' => $outing->category,
                ]),

            'newDiscoveries' => Discovery::query()
                ->with('outing')
                ->latest()
                ->take(8)
                ->get()
                ->map(fn ($discovery) => [
                    'id' => $discovery->id,
                    'title' => $discovery->title,
                    'slug' => $discovery->slug,
                    'type' => $discovery->type,
                    'description' => $discovery->description,
                    'image' => $discovery->image,
                    'outing_title' => $discovery->outing?->title,
                ]),

            'categories' => $categories,
            'activeCategory' => $category,
            'heroSettings' => [
                'background_url' => SiteSetting::get('hero_background_url', 'https://images.unsplash.com/photo-1476234251651-f4057e9633ae?w=1920&q=80'),
                'title' => SiteSetting::get('hero_title', 'De Ongeplande Route'),
                'subtitle' => SiteSetting::get('hero_subtitle', 'Geen plan. Wel verhalen.'),
                'description' => SiteSetting::get('hero_description', 'Wij rijden. Jullie ontdekken mee.'),
            ],
        ]);
    }
}
