<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => [
                'hero_background_url' => SiteSetting::get('hero_background_url'),
                'hero_title' => SiteSetting::get('hero_title'),
                'hero_subtitle' => SiteSetting::get('hero_subtitle'),
                'hero_description' => SiteSetting::get('hero_description'),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hero_background_url' => 'nullable|url|max:2048',
            'hero_background_image' => 'nullable|image|max:5120',
            'hero_title' => 'required|string|max:255',
            'hero_subtitle' => 'required|string|max:255',
            'hero_description' => 'required|string|max:500',
        ]);

        if ($request->hasFile('hero_background_image')) {
            $path = $request->file('hero_background_image')->store('site', 'public');
            $validated['hero_background_url'] = Storage::url($path);
        }

        SiteSetting::set('hero_background_url', $validated['hero_background_url'] ?? SiteSetting::get('hero_background_url'));
        SiteSetting::set('hero_title', $validated['hero_title']);
        SiteSetting::set('hero_subtitle', $validated['hero_subtitle']);
        SiteSetting::set('hero_description', $validated['hero_description']);

        return redirect()->route('admin.settings.index')->with('success', 'Site instellingen opgeslagen.');
    }
}
