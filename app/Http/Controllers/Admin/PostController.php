<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Avontuur;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(): Response
    {
        $posts = Post::query()
            ->with('user')
            ->latest('created_at')
            ->paginate(15);

        return Inertia::render('Admin/Blog/Index', [
            'posts' => $posts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Blog/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:posts,slug',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|string|max:500',
            'youtube_url' => 'nullable|url|max:255',
            'status' => 'required|in:draft,published',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);

        if ($validated['status'] === 'published' && empty($validated['published_at'] ?? null)) {
            $validated['published_at'] = now();
        }

        $post = Post::create($validated);

        return redirect()->route('admin.blog.edit', $post)
            ->with('success', 'Blogpost aangemaakt!');
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('Admin/Blog/Edit', [
            'post' => $post,
        ]);
    }

    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:posts,slug,'.$post->id,
            'excerpt' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|string|max:500',
            'youtube_url' => 'nullable|url|max:255',
            'status' => 'required|in:draft,published',
        ]);

        if ($validated['status'] === 'published' && $post->published_at === null) {
            $validated['published_at'] = now();
        } elseif ($validated['status'] === 'draft') {
            $validated['published_at'] = null;
        }

        $post->update($validated);

        return back()->with('success', 'Blogpost opgeslagen!');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return redirect()->route('admin.blog.index')
            ->with('success', 'Blogpost verwijderd!');
    }

    public function quickNote(): Response
    {
        $draftPosts = Post::query()
            ->where('status', 'draft')
            ->latest()
            ->limit(30)
            ->get(['id', 'title', 'avontuur_id']);

        $avonturen = Avontuur::query()
            ->latest()
            ->limit(50)
            ->get(['id', 'title', 'location', 'start_date']);

        return Inertia::render('Admin/Blog/QuickNote', [
            'draftPosts' => $draftPosts,
            'avonturen' => $avonturen,
        ]);
    }

    public function storeQuickNote(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'note' => 'required|string|max:10000',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|max:20480',
            'post_id' => 'nullable|exists:posts,id',
            'new_post_title' => 'nullable|string|max:255',
            'avontuur_id' => 'nullable|exists:avonturen,id',
            'new_avontuur_title' => 'nullable|string|max:255',
            'new_avontuur_location' => 'nullable|string|max:255',
            'new_avontuur_start_date' => 'nullable|date',
        ]);

        if (empty($validated['post_id']) && empty($validated['new_post_title'])) {
            return back()->withErrors(['new_post_title' => 'Vul een titel in voor de nieuwe post.']);
        }

        // Create new avontuur inline if requested
        $avontuurId = $validated['avontuur_id'] ?? null;
        if (empty($avontuurId) && ! empty($validated['new_avontuur_title'])) {
            $avontuur = Avontuur::create([
                'user_id' => Auth::id(),
                'title' => $validated['new_avontuur_title'],
                'location' => $validated['new_avontuur_location'] ?? null,
                'start_date' => $validated['new_avontuur_start_date'] ?? null,
            ]);
            $avontuurId = $avontuur->id;
        }

        // Build HTML from note text
        $lines = array_filter(array_map('trim', explode("\n", $validated['note'])));
        $contentHtml = implode('', array_map(fn (string $line) => '<p>'.e($line).'</p>', $lines));

        // Upload images and append as figures
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('blog', 'public');
                $url = Storage::url($path);
                $contentHtml .= '<figure><img src="'.e($url).'" alt="" class="rounded-lg max-w-full my-4 mx-auto block shadow-md" /></figure>';
            }
        }

        if (! empty($validated['post_id'])) {
            $post = Post::findOrFail($validated['post_id']);
            $post->content = ($post->content ?? '').$contentHtml;
            if ($avontuurId !== null) {
                $post->avontuur_id = $avontuurId;
            }
            $post->save();
        } else {
            Post::create([
                'user_id' => Auth::id(),
                'avontuur_id' => $avontuurId,
                'title' => $validated['new_post_title'],
                'content' => $contentHtml,
                'status' => 'draft',
            ]);
        }

        return redirect()->back()->with('success', 'Notitie opgeslagen! ✅');
    }
}
