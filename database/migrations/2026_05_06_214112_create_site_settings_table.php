<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Default instellingen
        DB::table('site_settings')->insert([
            ['key' => 'hero_background_url', 'value' => 'https://images.unsplash.com/photo-1476234251651-f4057e9633ae?w=1920&q=80', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'hero_title', 'value' => 'De Ongeplande Route', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'hero_subtitle', 'value' => 'Geen plan. Wel verhalen.', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'hero_description', 'value' => 'Wij rijden. Jullie ontdekken mee.', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
