<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $posts = DB::table('posts')->orderBy('id')->get();

        foreach ($posts as $post) {
            $slug = $post->slug;
            $attempt = 0;

            while (DB::table('stories')->where('slug', $slug)->exists()) {
                $attempt++;
                $slug = $post->slug.'-'.$attempt;
            }

            DB::table('stories')->insert([
                'title' => $post->title,
                'slug' => $slug,
                'description' => $post->excerpt,
                'content' => $post->content,
                'gallery_images' => $post->gallery_images,
                'featured_image' => $post->featured_image,
                'youtube_url' => $post->youtube_url,
                'library_video_url' => $post->library_video_url,
                'status' => $post->status === 'published' ? 'published' : 'draft',
                'published_at' => $post->published_at,
                'user_id' => $post->user_id,
                'ai_settings' => null,
                'generated_content' => null,
                'created_at' => $post->created_at,
                'updated_at' => $post->updated_at,
            ]);
        }
    }

    public function down(): void
    {
        // Cannot safely reverse — do not delete stories on rollback
    }
};
