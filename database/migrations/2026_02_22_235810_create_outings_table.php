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
        Schema::create('outings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('story');
            $table->string('location')->nullable();
            $table->string('city')->nullable();
            $table->string('price_info')->nullable();
            $table->string('mood')->nullable();
            $table->string('featured_image')->nullable();
            $table->json('images')->nullable();
            $table->boolean('is_recommended')->default(false);
            $table->boolean('is_free')->default(false);
            $table->string('category')->nullable();
            $table->date('visit_date')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('outings');
    }
};
