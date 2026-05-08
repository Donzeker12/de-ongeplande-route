<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('discoveries', function (Blueprint $table) {
            // Make outing_id optional
            $table->foreignId('outing_id')->nullable()->change();

            // Add optional venue link
            $table->foreignId('venue_id')->nullable()->after('outing_id')->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('discoveries', function (Blueprint $table) {
            $table->dropConstrainedForeignId('venue_id');
            $table->foreignId('outing_id')->nullable(false)->change();
        });
    }
};
