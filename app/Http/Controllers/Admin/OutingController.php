<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\ShareToSocialMedia;
use App\Models\Category;
use App\Models\Outing;
use App\Models\Venue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OutingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $outings = Outing::query()
            ->with(['discoveries'])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%");
                });
            })
            ->latest('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Outings/Index', [
            'outings' => $outings,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Toggle the published status of the outing.
     */
    public function togglePublished(Outing $outing): RedirectResponse
    {
        $outing->update([
            'published_at' => $outing->published_at ? null : now(),
        ]);

        $status = $outing->published_at ? 'gepubliceerd' : 'gedepubliceerd';

        return back()->with('success', "Uitje succesvol {$status}!");
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Outings/Create', [
            'categories' => Category::orderBy('sort_order')->orderBy('name')->get(['id', 'name', 'emoji']),
            'venues'     => Venue::orderBy('name')->get(['id', 'name', 'type', 'city']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:outings,slug',
            'story' => 'required|string',
            'location' => 'nullable|string',
            'city' => 'nullable|string',
            'price_info' => 'nullable|string',
            'price_details' => 'nullable|array',
            'price_details.adult' => 'nullable|string|max:50',
            'price_details.child' => 'nullable|string|max:50',
            'price_details.senior' => 'nullable|string|max:50',
            'price_details.baby' => 'nullable|string|max:50',
            'price_details.passes' => 'nullable|array',
            'price_details.passes.*.name' => 'required_with:price_details.passes|string|max:100',
            'price_details.passes.*.discount' => 'nullable|string|max:100',
            'price_details.discount_codes' => 'nullable|array',
            'price_details.discount_codes.*.code' => 'required_with:price_details.discount_codes|string|max:50',
            'price_details.discount_codes.*.description' => 'nullable|string|max:100',
            'price_details.discount_codes.*.expires_at' => 'nullable|date',
            'price_details.notes' => 'nullable|string|max:255',
            'mood' => 'nullable|string',
        $count = 1;
        while (Outing::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug.'-'.$count++;
        }

        // Auto-set published_at if not provided
        if (empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $outing = Outing::create($validated);

        if ($shareFacebook || $shareInstagram) {
            ShareToSocialMedia::dispatch($outing, [
                'facebook' => $shareFacebook,
                'instagram' => $shareInstagram,
            ]);
        }

        return redirect()->route('admin.outings.edit', $outing)
            ->with('success', 'Uitje succesvol aangemaakt!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Outing $outing): Response
    {
        $outing->load(['discoveries']);

        return Inertia::render('Admin/Outings/Show', [
            'outing' => $outing,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Outing $outing): Response
    {
        $outing->load(['discoveries']);

        return Inertia::render('Admin/Outings/Edit', [
            'outing'     => $outing,
            'categories' => Category::orderBy('sort_order')->orderBy('name')->get(['id', 'name', 'emoji']),
            'venues'     => Venue::orderBy('name')->get(['id', 'name', 'type', 'city']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Outing $outing)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:outings,slug,'.$outing->id,
            'story' => 'required|string',
            'location' => 'nullable|string',
            'city' => 'nullable|string',
            'price_info' => 'nullable|string',
            'price_details' => 'nullable|array',
            'price_details.adult' => 'nullable|string|max:50',
            'price_details.child' => 'nullable|string|max:50',
            'price_details.senior' => 'nullable|string|max:50',
            'price_details.baby' => 'nullable|string|max:50',
            'price_details.passes' => 'nullable|array',
            'price_details.passes.*.name' => 'required_with:price_details.passes|string|max:100',
            'price_details.passes.*.discount' => 'nullable|string|max:100',
            'price_details.discount_codes' => 'nullable|array',
            'price_details.discount_codes.*.code' => 'required_with:price_details.discount_codes|string|max:50',
            'price_details.discount_codes.*.description' => 'nullable|string|max:100',
            'price_details.discount_codes.*.expires_at' => 'nullable|date',
            'price_details.notes' => 'nullable|string|max:255',
            'mood' => 'nullable|string',
            'featured_image' => 'nullable|url',
            'images' => 'nullable|array',
            'images.*' => 'url',
            'is_recommended' => 'boolean',
            'is_free' => 'boolean',
            'category' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'venue_id' => 'nullable|exists:venues,id',
            'visit_date' => 'nullable|date',
            'published_at' => 'nullable|date',
            'share_facebook' => 'boolean',
            'share_instagram' => 'boolean',
        ]);

        $shareFacebook = (bool) ($validated['share_facebook'] ?? false);
        $shareInstagram = (bool) ($validated['share_instagram'] ?? false);
        unset($validated['share_facebook'], $validated['share_instagram']);

        // Update slug if title changed
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $outing->update($validated);

        if ($shareFacebook || $shareInstagram) {
            ShareToSocialMedia::dispatch($outing, [
                'facebook' => $shareFacebook,
                'instagram' => $shareInstagram,
            ]);
        }

        return redirect()->route('admin.outings.edit', $outing)
            ->with('success', 'Uitje succesvol bijgewerkt!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Outing $outing)
    {
        $outing->delete();

        return redirect()->route('admin.outings.index')
            ->with('success', 'Uitje succesvol verwijderd!');
    }
}
