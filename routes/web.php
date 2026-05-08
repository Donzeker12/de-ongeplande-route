<?php

use App\Http\Controllers\DiscoveryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OutingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\VenueController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', HomeController::class)->name('home');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('/uitjes/{outing:slug}', OutingController::class)->name('outings.show');
Route::get('/ontdekkingen/{discovery:slug}', [DiscoveryController::class, 'show'])->name('discoveries.show');
Route::get('/over-ons', fn () => Inertia::render('OverOns'))->name('over-ons');
Route::get('/locaties', [VenueController::class, 'index'])->name('venues.index');
Route::get('/locaties/{venue:slug}', [VenueController::class, 'show'])->name('venues.show');

// Auth required routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        // Redirect admins to admin dashboard
        if (auth()->user()->is_admin) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
