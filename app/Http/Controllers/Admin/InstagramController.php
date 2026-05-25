<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\SiteSetting;
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
            'defaultHashtags' => SiteSetting::get('instagram_hashtags') ?? '#deongeplanderoute #instagood #travel #familytravel #wanderlust #travelgram #nederland #gezin #weekenduitje #uitje #reisverhaal #roadtrip #familytime #nederlandseblog #photooftheday',
        ]);
    }

    public function post(Request $request, SocialShareService $service): RedirectResponse
    {
        $validated = $request->validate([
            'image_url' => 'required|string|max:2048',
            'caption' => 'required|string|max:2200',
        ]);

        $hashtags = SiteSetting::get('instagram_hashtags') ?? '#deongeplanderoute #instagood #travel #familytravel #wanderlust #travelgram #nederland #gezin #weekenduitje #uitje #reisverhaal #roadtrip #familytime #nederlandseblog #photooftheday';
        $fullCaption = $validated['caption']."\n\n".$hashtags;

        $request->validate([
            'caption' => ['max:'.(2200 - strlen("\n\n".$hashtags))],
        ]);

        $result = $service->postToInstagram($validated['image_url'], $fullCaption);

        if ($result['success']) {
            return redirect()->route('admin.instagram.compose')
                ->with('success', 'Foto succesvol gedeeld op Instagram!');
        }

        return redirect()->back()
            ->with('error', 'Instagram posten mislukt: '.($result['error'] ?? 'Onbekende fout'));
    }
}
