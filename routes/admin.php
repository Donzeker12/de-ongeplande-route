<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DiscoveryController;
use App\Http\Controllers\Admin\ImageUploadController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\OutingController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\QuickCaptureController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\SocialSnippetController;
use App\Http\Controllers\Admin\StoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VenueController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Admin routes - require authentication AND admin status
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/dashboard', function () {
        $outings = \App\Models\Outing::query();
        $discoveries = \App\Models\Discovery::query();
        $stories = \App\Models\Story::query();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_outings' => $outings->count(),
                'published_outings' => (clone $outings)->whereNotNull('published_at')->count(),
                'recommended_outings' => (clone $outings)->where('is_recommended', true)->count(),
                'total_discoveries' => $discoveries->count(),
                'free_outings' => (clone $outings)->where('is_free', true)->count(),
                'total_stories' => $stories->count(),
                'completed_stories' => (clone $stories)->where('status', 'completed')->count(),
                'published_stories' => (clone $stories)->where('status', 'published')->count(),
            ],
            'recent_outings' => \App\Models\Outing::query()
                ->with('discoveries')
                ->latest('created_at')
                ->limit(5)
                ->get(),
            'recent_discoveries' => \App\Models\Discovery::query()
                ->with('outing')
                ->latest('created_at')
                ->limit(5)
                ->get(),
            'recent_stories' => \App\Models\Story::query()
                ->with('user')
                ->latest('created_at')
                ->limit(5)
                ->get(),
        ]);
    })->name('dashboard');

    // Quick Capture for mobile/field use
    Route::get('/quick-capture', [QuickCaptureController::class, 'index'])->name('quick-capture');
    Route::post('/quick-capture', [QuickCaptureController::class, 'store'])->name('quick-capture.store');
    Route::get('/api/location-suggestions', [QuickCaptureController::class, 'getLocationSuggestions'])->name('location-suggestions');

    // Outings (Uitjes) management
    Route::patch('/outings/{outing}/toggle-published', [OutingController::class, 'togglePublished'])->name('outings.toggle-published');
    Route::resource('outings', OutingController::class);

    // Discoveries (Ontdekkingen) management
    Route::resource('discoveries', DiscoveryController::class);

    // Social Snippets
    Route::resource('snippets', SocialSnippetController::class);

    // Users
    Route::resource('users', UserController::class);

    // Categories
    Route::resource('categories', CategoryController::class)->except('show');

    // Venues
    Route::resource('venues', VenueController::class)->except('show');

    // Stories
    Route::resource('stories', StoryController::class);
    Route::post('stories/{story}/generate', [StoryController::class, 'generateStory'])->name('stories.generate');

    // Blog
    Route::get('/blog/quick-note', [PostController::class, 'quickNote'])->name('blog.quick-note');
    Route::post('/blog/quick-note', [PostController::class, 'storeQuickNote'])->name('blog.quick-note.store');
    Route::resource('blog', PostController::class)->except('show')->parameters(['blog' => 'post']);

    // Image upload (legacy)
    Route::post('/upload-image', ImageUploadController::class)->name('upload-image');

    // Media bibliotheek
    Route::get('/media/list', [MediaController::class, 'list'])->name('media.list');
    Route::resource('media', MediaController::class)->only(['index', 'store', 'destroy']);

    // Site instellingen
    Route::get('/settings', [SiteSettingController::class, 'index'])->name('settings.index');
    Route::put('/settings', [SiteSettingController::class, 'update'])->name('settings.update');
    Route::post('/settings', [SiteSettingController::class, 'update']);
});
