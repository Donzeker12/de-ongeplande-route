<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Story;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StoryController extends Controller
{
    public function index()
    {
        $stories = Story::with(['user'])
            ->withCount('chapters')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/Stories/Index', [
            'stories' => $stories,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Stories/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'youtube_url' => 'nullable|url|max:255',
            'featured_image' => 'nullable|string|max:500',
            'ai_settings' => 'nullable|array',
            'chapters' => 'required|array|min:1',
            'chapters.*.title' => 'required|string|max:255',
            'chapters.*.content' => 'nullable|string|max:2000',
        ]);

        $story = Story::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'youtube_url' => $validated['youtube_url'] ?? null,
            'featured_image' => $validated['featured_image'] ?? null,
            'user_id' => Auth::id(),
            'ai_settings' => $validated['ai_settings'] ?? [],
            'status' => 'draft',
        ]);

        foreach ($validated['chapters'] as $index => $chapterData) {
            Chapter::create([
                'story_id' => $story->id,
                'title' => $chapterData['title'],
                'content' => $chapterData['content'] ?? '',
                'order' => $index + 1,
            ]);
        }

        return redirect()->route('admin.stories.edit', $story)
            ->with('success', 'Story aangemaakt! Je kunt nu hoofdstukken toevoegen.');
    }

    public function show(Story $story)
    {
        $this->authorize('view', $story);

        $story->load('chapters');

        return Inertia::render('Admin/Stories/Show', [
            'story' => $story,
        ]);
    }

    public function edit(Story $story)
    {
        $this->authorize('update', $story);

        $story->load('chapters');

        return Inertia::render('Admin/Stories/Edit', [
            'story' => $story,
        ]);
    }

    public function update(Request $request, Story $story)
    {
        $this->authorize('update', $story);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'youtube_url' => 'nullable|url|max:255',
            'featured_image' => 'nullable|string|max:500',
            'ai_settings' => 'nullable|array',
        ]);

        $story->update($validated);

        return back()->with('success', 'Story bijgewerkt!');
    }

    public function generateStory(Request $request, Story $story, GeminiService $geminiService)
    {
        $this->authorize('update', $story);

        if (! $story->canGenerate()) {
            return back()->with('error', 'Story kan niet gegenereerd worden. Voeg eerst hoofdstukken toe.');
        }

        // Set status to generating
        $story->update(['status' => 'generating']);

        try {
            // Use Gemini Flash to generate the story
            $result = $geminiService->generateStory($story);

            if ($result['success']) {
                // Update story with generated content
                $story->update([
                    'generated_content' => $result['content'],
                    'status' => 'completed',
                ]);

                return back()->with('success', '🎉 Verhaal succesvol gegenereerd door AI!');
            } else {
                // Reset status on failure
                $story->update(['status' => 'draft']);

                return back()->with('error', '❌ AI generatie mislukt: '.$result['error']);
            }

        } catch (\Exception $e) {
            // Reset status on exception
            $story->update(['status' => 'draft']);

            return back()->with('error', '❌ Fout bij AI generatie: '.$e->getMessage());
        }
    }

    public function destroy(Story $story)
    {
        $this->authorize('delete', $story);

        $story->delete();

        return redirect()->route('admin.stories.index')
            ->with('success', 'Story verwijderd!');
    }
}
