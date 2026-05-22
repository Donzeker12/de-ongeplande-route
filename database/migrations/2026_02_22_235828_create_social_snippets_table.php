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
        Schema::create('social_snippets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outing_id')->constrained()->cascadeOnDelete();
            $table->enum('platform', ['tiktok', 'instagram', 'facebook']);
            $table->text('hook_text');
            $table->text('caption');
            $table->text('teaser_content')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_snippets');
    }
};
