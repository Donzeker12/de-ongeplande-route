<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stories', function (Blueprint $table) {
            $table->longText('content')->nullable()->after('description');
            $table->json('gallery_images')->nullable()->after('featured_image');
            $table->string('library_video_url')->nullable()->after('youtube_url');
        });
    }

    public function down(): void
    {
        Schema::table('stories', function (Blueprint $table) {
            $table->dropColumn(['content', 'gallery_images', 'library_video_url']);
        });
    }
};
