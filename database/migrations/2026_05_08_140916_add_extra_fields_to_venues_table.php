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
        Schema::table('venues', function (Blueprint $table) {
            $table->text('opening_hours')->nullable()->after('featured_image');
            $table->text('prices')->nullable()->after('opening_hours');
            $table->text('highlights')->nullable()->after('prices');
            $table->text('accessibility_transport')->nullable()->after('highlights');
            $table->text('accessibility_facilities')->nullable()->after('accessibility_transport');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('venues', function (Blueprint $table) {
            $table->dropColumn([
                'opening_hours',
                'prices',
                'highlights',
                'accessibility_transport',
                'accessibility_facilities',
            ]);
        });
    }
};
