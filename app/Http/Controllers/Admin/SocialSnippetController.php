<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Outing;
use App\Models\SocialSnippet;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SocialSnippetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $snippets = SocialSnippet::query()
            ->with('outing')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('hook_text', 'like', "%{$search}%")
                        ->orWhere('platform', 'like', "%{$search}%")
                        ->orWhereHas('outing', fn ($oq) => $oq->where('title', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Snippets/Index', [
            'snippets' => $snippets,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $outings = Outing::query()->orderBy('title')->get(['id', 'title']);

        return Inertia::render('Admin/Snippets/Create', [
            'outings' => $outings,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'outing_id' => ['required', 'exists:outings,id'],
            'platform' => ['required', 'in:tiktok,instagram,facebook'],
            'hook_text' => ['required', 'string'],
            'caption' => ['required', 'string'],
            'teaser_content' => ['nullable', 'string'],
            'published_at' => ['nullable', 'date'],
        ]);

        SocialSnippet::create($validated);

        return redirect()->route('admin.snippets.index')
            ->with('success', 'Social snippet succesvol aangemaakt!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SocialSnippet $snippet): Response
    {
        $outings = Outing::query()->orderBy('title')->get(['id', 'title']);

        return Inertia::render('Admin/Snippets/Edit', [
            'snippet' => $snippet->load('outing'),
            'outings' => $outings,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SocialSnippet $snippet): RedirectResponse
    {
        $validated = $request->validate([
            'outing_id' => ['required', 'exists:outings,id'],
            'platform' => ['required', 'in:tiktok,instagram,facebook'],
            'hook_text' => ['required', 'string'],
            'caption' => ['required', 'string'],
            'teaser_content' => ['nullable', 'string'],
            'published_at' => ['nullable', 'date'],
        ]);

        $snippet->update($validated);

        return redirect()->route('admin.snippets.edit', $snippet)
            ->with('success', 'Social snippet succesvol bijgewerkt!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SocialSnippet $snippet): RedirectResponse
    {
        $snippet->delete();

        return redirect()->route('admin.snippets.index')
            ->with('success', 'Social snippet succesvol verwijderd!');
    }
}
