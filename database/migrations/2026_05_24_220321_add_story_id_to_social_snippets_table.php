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
        Schema::table('social_snippets', function (Blueprint $table) {
            $table->foreignId('story_id')->nullable()->after('outing_id')->constrained()->nullOnDelete();
            $table->foreignId('outing_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('social_snippets', function (Blueprint $table) {
            $table->dropConstrainedForeignId('story_id');
            $table->foreignId('outing_id')->nullable(false)->change();
        });
    }
};
