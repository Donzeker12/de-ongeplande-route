<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class VenueController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $type = $request->query('type');

        $venues = Venue::query()
            ->when($search, fn ($q) => $q->where(function ($sq) use ($search) {
                $sq->where('name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%");
            }))
            ->when($type, fn ($q) => $q->where('type', $type))
            ->withCount('outings')
            ->orderBy('name')
            ->paginate(30)
            ->withQueryString();

        return Inertia::render('Admin/Venues/Index', [
            'venues' => $venues,
            'types' => Venue::$types,
            'filters' => ['search' => $search, 'type' => $type],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Venues/Create', [
            'types' => Venue::$types,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'slug' => 'nullable|string|max:200|unique:venues,slug',
            'type' => 'required|in:'.implode(',', array_keys(Venue::$types)),
            'description' => 'nullable|string|max:5000',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:300',
            'website' => 'nullable|url|max:300',
            'featured_image' => 'nullable|url|max:500',
            'opening_hours' => 'nullable|array',
            'prices' => 'nullable|array',
            'highlights' => 'nullable|string|max:2000',
            'accessibility_transport' => 'nullable|string|max:2000',
            'accessibility_facilities' => 'nullable|string|max:2000',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $validated['country'] = $validated['country'] ?? 'Nederland';

        $venue = Venue::create($validated);

        return redirect()->route('admin.venues.index')
            ->with('success', "{$venue->name} toegevoegd!");
    }

    public function edit(Venue $venue): Response
    {
        return Inertia::render('Admin/Venues/Edit', [
            'venue' => $venue,
            'types' => Venue::$types,
        ]);
    }

    public function update(Request $request, Venue $venue): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'slug' => "nullable|string|max:200|unique:venues,slug,{$venue->id}",
            'type' => 'required|in:'.implode(',', array_keys(Venue::$types)),
            'description' => 'nullable|string|max:5000',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:300',
            'website' => 'nullable|url|max:300',
            'featured_image' => 'nullable|url|max:500',
            'opening_hours' => 'nullable|array',
            'prices' => 'nullable|array',
            'highlights' => 'nullable|string|max:2000',
            'accessibility_transport' => 'nullable|string|max:2000',
            'accessibility_facilities' => 'nullable|string|max:2000',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $venue->update($validated);

        return redirect()->route('admin.venues.index')
            ->with('success', "{$venue->name} bijgewerkt!");
    }

    public function destroy(Venue $venue): RedirectResponse
    {
        $venue->delete();

        return redirect()->route('admin.venues.index')
            ->with('success', "{$venue->name} verwijderd!");
    }
}
