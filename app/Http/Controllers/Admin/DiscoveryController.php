<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDiscoveryRequest;
use App\Http\Requests\Admin\UpdateDiscoveryRequest;
use App\Models\Discovery;
use App\Models\Outing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DiscoveryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $discoveries = Discovery::query()
            ->with('outing')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('type', 'like', "%{$search}%")
                        ->orWhereHas('outing', fn ($oq) => $oq->where('title', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Discoveries/Index', [
            'discoveries' => $discoveries,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $outings = Outing::query()
            ->orderBy('title')
            ->get(['id', 'title']);

        return Inertia::render('Admin/Discoveries/Create', [
            'outings' => $outings,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDiscoveryRequest $request): RedirectResponse
    {
        Discovery::create($request->validated());

        return redirect()->route('admin.discoveries.index')
            ->with('success', 'Ontdekking succesvol aangemaakt!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Discovery $discovery): Response
    {
        $outings = Outing::query()
            ->orderBy('title')
            ->get(['id', 'title']);

        return Inertia::render('Admin/Discoveries/Edit', [
            'discovery' => $discovery->load('outing'),
            'outings' => $outings,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDiscoveryRequest $request, Discovery $discovery): RedirectResponse
    {
        $discovery->update($request->validated());

        return redirect()->route('admin.discoveries.edit', $discovery)
            ->with('success', 'Ontdekking succesvol bijgewerkt!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Discovery $discovery): RedirectResponse
    {
        $discovery->delete();

        return redirect()->route('admin.discoveries.index')
            ->with('success', 'Ontdekking succesvol verwijderd!');
    }
}
