<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('discoveries', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('title');
        });

        // Generate slugs for existing discoveries
        DB::table('discoveries')->get()->each(function ($discovery) {
            $slug = Str::slug($discovery->title);
            // Handle duplicates by adding ID
            $count = DB::table('discoveries')
                ->where('slug', $slug)
                ->where('id', '!=', $discovery->id)
                ->count();
            
            if ($count > 0) {
                $slug = $slug . '-' . $discovery->id;
            }

            DB::table('discoveries')
                ->where('id', $discovery->id)
                ->update(['slug' => $slug]);
        });

        // Now add unique constraint
        Schema::table('discoveries', function (Blueprint $table) {
            $table->unique('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('discoveries', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
