<?php

namespace App\Http\Controllers;

use App\Models\Discovery;
use Inertia\Inertia;

class DiscoveryController extends Controller
{
    public function show(Discovery $discovery)
    {
        $discovery->load([
            'outing.venue',
            'venue',
        ]);

        // Use the discovery's own venue first, fall back to the outing's venue
        $venue = $discovery->venue ?? $discovery->outing?->venue;

        return Inertia::render('Discovery/Show', [
            'discovery' => $discovery,
            'outing' => $discovery->outing,
            'venue' => $venue,
        ]);
    }
}
