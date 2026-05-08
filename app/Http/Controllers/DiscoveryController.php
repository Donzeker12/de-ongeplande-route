<?php

namespace App\Http\Controllers;

use App\Models\Discovery;
use Inertia\Inertia;

class DiscoveryController extends Controller
{
    public function show(Discovery $discovery)
    {
        // Load the discovery with its outing and venue information
        $discovery->load([
            'outing.venue',
            'outing'
        ]);

        return Inertia::render('Discovery/Show', [
            'discovery' => $discovery,
            'outing' => $discovery->outing,
            'venue' => $discovery->outing?->venue
        ]);
    }
}
