<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Media;
use App\Models\Story;
use App\Services\GeminiService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StoryController extends Controller
{
    public function index(): Response
    {
        $stories = Story::with(['user'])
            ->withCount('chapters')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/Stories/Index', [
            'stories' => $stories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Stories/Create', [
            'mediaImages' => Media::query()->where('mime_type', 'LIKE', 'image/%')->latest()->get(['id', 'url', 'filename']),
            'mediaVideos' => Media::query()->where('mime_type', 'LIKE', 'video/%')->latest()->get(['id', 'url', 'filename']),
        ]);
    }

    public function quickNote(): Response
    {
        $recentStories = Story::orderBy('created_at', 'desc')
            ->limit(20)
            ->get(['id', 'title', 'status']);

        return Inertia::render('Admin/Stories/QuickNote', [
            'recentStories' => $recentStories,
        ]);
    }

    public function storeQuickNote(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'youtube_url' => 'nullable|url|max:255',
            'featured_image' => 'nullable|image|max:10240',
            'video_file' => 'nullable|mimetypes:video/mp4,video/quicktime,video/webm,video/x-msvideo|max:204800',
            'existing_story_id' => 'nullable|exists:stories,id',
        ]);

        // Auto-generate title from content or timestamp
        $title = ! empty($validated['title']) ? $validated['title'] : null;
        if (empty($title)) {
            $plainText = strip_tags($validated['content'] ?? '');
            $words = array_filter(explode(' ', $plainText));
            $title = implode(' ', array_slice($words, 0, 6));
            $title = mb_substr($title, 0, 60) ?: 'Notitie '.now()->format('d M Y H:i');
        }

        // Handle image upload
        $imageUrl = null;
        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('stories', 'public');
            $imageUrl = Storage::disk('public')->url($path);
        }

        // Handle video upload
        $videoUrl = null;
        if ($request->hasFile('video_file')) {
            $path = $request->file('video_file')->store('stories/videos', 'public');
            $videoUrl = Storage::disk('public')->url($path);
        }

        // Build HTML content (tekst + foto + video direct in TipTap editor)
        $htmlParts = [];
        if (! empty($validated['content'])) {
            $paragraphs = array_filter(array_map('trim', explode("\n", $validated['content'])));
            foreach ($paragraphs as $paragraph) {
                $htmlParts[] = '<p>'.e($paragraph).'</p>';
            }
        }
        if ($imageUrl) {
            $htmlParts[] = '<img src="'.$imageUrl.'" alt="">';
        }
        if ($videoUrl) {
            $htmlParts[] = '<video src="'.$videoUrl.'" controls></video>';
        }
        $htmlContent = implode('', $htmlParts) ?: null;

        // Append to existing story's TipTap content
        if (! empty($validated['existing_story_id'])) {
            $story = Story::findOrFail($validated['existing_story_id']);
            $separator = $story->content ? '<hr>' : '';
            $story->update([
                'content' => ($story->content ?? '').$separator.$htmlContent,
                'featured_image' => $story->featured_image ?? $imageUrl,
            ]);

            return redirect()->route('admin.stories.edit', $story)
                ->with('success', 'Notitie toegevoegd aan het verhaal!');
        }

        // Create new draft story
        $story = Story::create([
            'title' => $title,
            'slug' => Str::slug($title).'-'.now()->format('YmdHis'),
            'content' => $htmlContent,
            'youtube_url' => $validated['youtube_url'] ?? null,
            'library_video_url' => $videoUrl,
            'featured_image' => $imageUrl,
            'status' => 'draft',
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('admin.stories.edit', $story)
            ->with('success', 'Snelle notitie opgeslagen! Je kunt hem nu verder uitwerken.');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:stories,slug',
            'description' => 'nullable|string|max:1000',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|string|max:500',
            'gallery_images' => 'nullable|array|max:50',
            'gallery_images.*' => 'nullable|string|max:500',
            'youtube_url' => 'nullable|url|max:255',
            'library_video_url' => 'nullable|string|max:500',
            'ai_settings' => 'nullable|array',
            'chapters' => 'nullable|array',
            'chapters.*.title' => 'required_with:chapters|string|max:255',
            'chapters.*.content' => 'nullable|string|max:2000',
            'status' => 'required|in:draft,published',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);
        $validated['gallery_images'] = array_values(array_filter($validated['gallery_images'] ?? []));

        if ($validated['status'] === 'published') {
            $validated['published_at'] = now();
        }

        $chapters = $validated['chapters'] ?? [];
        unset($validated['chapters']);

        $story = Story::create($validated);

        foreach ($chapters as $index => $chapterData) {
            Chapter::create([
                'story_id' => $story->id,
                'title' => $chapterData['title'],
                'content' => $chapterData['content'] ?? '',
                'order' => $index + 1,
            ]);
        }

        return redirect()->route('admin.stories.edit', $story)
            ->with('success', 'Verhaal aangemaakt!');
    }

    public function show(Story $story): Response
    {
        $this->authorize('view', $story);

        $story->load('chapters');

        return Inertia::render('Admin/Stories/Show', [
            'story' => $story,
        ]);
    }

    public function edit(Story $story): Response
    {
        $this->authorize('update', $story);

        $story->load('chapters');

        return Inertia::render('Admin/Stories/Edit', [
            'story' => $story,
            'mediaImages' => Media::query()->where('mime_type', 'LIKE', 'image/%')->latest()->get(['id', 'url', 'filename']),
            'mediaVideos' => Media::query()->where('mime_type', 'LIKE', 'video/%')->latest()->get(['id', 'url', 'filename']),
        ]);
    }

    public function update(Request $request, Story $story): RedirectResponse
    {
        $this->authorize('update', $story);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:stories,slug,'.$story->id,
            'description' => 'nullable|string|max:1000',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|string|max:500',
            'gallery_images' => 'nullable|array|max:50',
            'gallery_images.*' => 'nullable|string|max:500',
            'youtube_url' => 'nullable|url|max:255',
            'library_video_url' => 'nullable|string|max:500',
            'ai_settings' => 'nullable|array',
            'chapters' => 'nullable|array',
            'chapters.*.id' => 'nullable|integer',
            'chapters.*.title' => 'required_with:chapters|string|max:255',
            'chapters.*.content' => 'nullable|string|max:2000',
            'chapters.*.order' => 'nullable|integer',
            'status' => 'required|in:draft,published',
        ]);

        $validated['gallery_images'] = array_values(array_filter($validated['gallery_images'] ?? []));

        if ($validated['status'] === 'published' && $story->published_at === null) {
            $validated['published_at'] = now();
        } elseif ($validated['status'] === 'draft') {
            $validated['published_at'] = null;
        }

        $chapters = $validated['chapters'] ?? null;
        unset($validated['chapters']);

        $story->update($validated);

        if ($chapters !== null) {
            $submittedIds = array_filter(array_column($chapters, 'id'));

            $story->chapters()->whereNotIn('id', $submittedIds)->delete();

            foreach ($chapters as $index => $chapterData) {
                if (! empty($chapterData['id'])) {
                    Chapter::where('id', $chapterData['id'])->update([
                        'title' => $chapterData['title'],
                        'content' => $chapterData['content'] ?? '',
                        'order' => $index + 1,
                    ]);
                } else {
                    Chapter::create([
                        'story_id' => $story->id,
                        'title' => $chapterData['title'],
                        'content' => $chapterData['content'] ?? '',
                        'order' => $index + 1,
                    ]);
                }
            }
        }

        return back()->with('success', 'Verhaal opgeslagen!');
    }

    public function generateStory(Request $request, Story $story, GeminiService $geminiService): RedirectResponse
    {
        $this->authorize('update', $story);

        if (! $story->canGenerate()) {
            return back()->with('error', 'Verhaal kan niet gegenereerd worden. Voeg eerst hoofdstukken toe.');
        }

        $story->update(['status' => 'generating']);

        try {
            $result = $geminiService->generateStory($story);

            if ($result['success']) {
                $story->update([
                    'generated_content' => $result['content'],
                    'status' => 'completed',
                ]);

                return back()->with('success', 'Verhaal succesvol gegenereerd door AI!');
            } else {
                $story->update(['status' => 'draft']);

                return back()->with('error', 'AI generatie mislukt: '.$result['error']);
            }
        } catch (\Exception $e) {
            $story->update(['status' => 'draft']);

            return back()->with('error', 'Fout bij AI generatie: '.$e->getMessage());
        }
    }

    public function destroy(Story $story): RedirectResponse
    {
        $this->authorize('delete', $story);

        $story->delete();

        return redirect()->route('admin.stories.index')
            ->with('success', 'Verhaal verwijderd!');
    }
}
