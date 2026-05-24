<?php

namespace App\Http\Controllers;

use App\Models\Story;
use Inertia\Inertia;
use Inertia\Response;

class VerhaalController extends Controller
{
    public function index(): Response
    {
        $stories = Story::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->latest('published_at')
            ->get()
            ->map(fn (Story $story) => [
                'id' => $story->id,
                'title' => $story->title,
                'slug' => $story->slug,
                'description' => $story->description,
                'featured_image' => $story->featured_image,
                'published_at' => $story->published_at?->toDateString(),
            ]);

        return Inertia::render('Verhalen/Index', [
            'stories' => $stories,
        ]);
    }

    public function show(Story $story): Response
    {
        abort_unless($story->status === 'published' && $story->published_at !== null, 404);

        $story->load('venues');

        return Inertia::render('Verhalen/Show', [
            'story' => [
                'id' => $story->id,
                'title' => $story->title,
                'slug' => $story->slug,
                'description' => $story->description,
                'content' => $story->content,
                'generated_content' => $story->generated_content,
                'youtube_url' => $story->youtube_url,
                'library_video_url' => $story->library_video_url,
                'featured_image' => $story->featured_image,
                'gallery_images' => $story->gallery_images,
                'published_at' => $story->published_at?->toDateString(),
                'venues' => $story->venues->map(fn ($v) => [
                    'id' => $v->id,
                    'name' => $v->name,
                    'slug' => $v->slug,
                    'type_label' => $v->type_label,
                    'type_emoji' => $v->type_emoji,
                    'city' => $v->city,
                    'featured_image' => $v->featured_image,
                ]),
            ],
        ]);
    }
}
