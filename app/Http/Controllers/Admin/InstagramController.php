<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Services\SocialShareService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InstagramController extends Controller
{
    public function compose(): Response
    {
        return Inertia::render('Admin/Instagram/Compose', [
            'mediaImages' => Media::query()
                ->where('mime_type', 'LIKE', 'image/%')
                ->latest()
                ->get(['id', 'url', 'filename']),
            'defaultHashtags' => \App\Models\SiteSetting::get('instagram_hashtags') ?? '#deongeplanderoute #weekenduitje #nederlandseblog #uitje #reisverhaal',
        ]);
    }

    public function post(Request $request, SocialShareService $service): RedirectResponse
    {
        $validated = $request->validate([
            'image_url' => 'required|string|max:2048',
            'caption' => 'required|string|max:2200',
        ]);

        $result = $service->postToInstagram($validated['image_url'], $validated['caption']);

        if ($result['success']) {
            return redirect()->route('admin.instagram.compose')
                ->with('success', 'Foto succesvol gedeeld op Instagram!');
        }

        return redirect()->back()
            ->with('error', 'Instagram posten mislukt: '.($result['error'] ?? 'Onbekende fout'));
    }
}
