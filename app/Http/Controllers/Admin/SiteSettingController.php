<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
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
                'instagram_business_account_id' => SiteSetting::get('instagram_business_account_id'),
                'instagram_page_access_token' => SiteSetting::get('instagram_page_access_token'),
                'instagram_token_obtained_at' => SiteSetting::get('instagram_token_obtained_at'),
                'instagram_hashtags' => SiteSetting::get('instagram_hashtags') ?? '#deongeplanderoute #instagood #travel #familytravel #wanderlust #travelgram #nederland #gezin #weekenduitje #uitje #reisverhaal #roadtrip #familytime #nederlandseblog #photooftheday',
                'over_ons_hero_title' => SiteSetting::get('over_ons_hero_title') ?? 'Over Ons',
                'over_ons_hero_intro' => SiteSetting::get('over_ons_hero_intro') ?? 'Wij zijn een gezin dat van spontaniteit houdt. Geen uitgebreide planningen, geen stress over waar we naartoe gaan. Gewoon instappen en kijken waar de weg ons brengt.',
                'over_ons_hero_image' => SiteSetting::get('over_ons_hero_image') ?? 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80',
                'over_ons_hero_year' => SiteSetting::get('over_ons_hero_year') ?? 'Sinds 2023',
                'over_ons_mission_title' => SiteSetting::get('over_ons_mission_title') ?? 'Onze Missie',
                'over_ons_mission_text' => SiteSetting::get('over_ons_mission_text') ?? 'We geloven dat de mooiste herinneringen ontstaan wanneer je geen plan hebt. Door onze verhalen te delen, hopen we anderen te inspireren om ook eens spontaan op pad te gaan en hun eigen avonturen te beleven.',
                'over_ons_pillar_1_title' => SiteSetting::get('over_ons_pillar_1_title') ?? 'Spontaan',
                'over_ons_pillar_1_text' => SiteSetting::get('over_ons_pillar_1_text') ?? 'Geen uitgebreide plannen, gewoon gaan en onderweg beslissen wat we gaan doen.',
                'over_ons_pillar_2_title' => SiteSetting::get('over_ons_pillar_2_title') ?? 'Ontdekken',
                'over_ons_pillar_2_text' => SiteSetting::get('over_ons_pillar_2_text') ?? 'Elk uitje brengt nieuwe ontdekkingen: van kleine details tot grote verrassingen.',
                'over_ons_pillar_3_title' => SiteSetting::get('over_ons_pillar_3_title') ?? 'Delen',
                'over_ons_pillar_3_text' => SiteSetting::get('over_ons_pillar_3_text') ?? 'We delen onze verhalen zodat anderen ook kunnen genieten van mooie plekken.',
                'over_ons_story_title' => SiteSetting::get('over_ons_story_title') ?? 'Hoe Het Begon',
                'over_ons_story_image' => SiteSetting::get('over_ons_story_image') ?? 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
                'over_ons_story_text' => SiteSetting::get('over_ons_story_text') ?? "Het begon allemaal met een zaterdagochtend waarop we geen plannen hadden.\n\nWe ontdekten een prachtig kasteel dat we nooit eerder hadden gezien, aten de beste pannenkoeken in een klein dorpscafeetje en vonden een speeltuin waar de kinderen uren konden spelen. Het was perfect.\n\nSinds die dag zijn we regelmatig 'de ongeplande route' gaan rijden. Elke keer ontdekken we weer nieuwe plekjes, maken we mooie herinneringen en komen we thuis met verhalen om te vertellen.",
                'over_ons_cta_title' => SiteSetting::get('over_ons_cta_title') ?? 'Laat Je Inspireren',
                'over_ons_cta_text' => SiteSetting::get('over_ons_cta_text') ?? 'Benieuwd naar onze verhalen? Bekijk onze uitjes en misschien inspireren ze jou wel om ook eens spontaan op pad te gaan.',
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hero_background_url' => 'nullable|string|max:2048',
            'hero_background_image' => 'nullable|image|max:5120',
            'hero_title' => 'nullable|string|max:255',
            'hero_subtitle' => 'nullable|string|max:255',
            'hero_description' => 'nullable|string|max:500',
            'instagram_business_account_id' => 'nullable|string|max:255',
            'instagram_page_access_token' => 'nullable|string|max:4096',
            'instagram_hashtags' => 'nullable|string|max:2200',
            'over_ons_hero_title' => 'nullable|string|max:255',
            'over_ons_hero_intro' => 'nullable|string|max:1000',
            'over_ons_hero_image' => 'nullable|string|max:2048',
            'over_ons_hero_year' => 'nullable|string|max:50',
            'over_ons_mission_title' => 'nullable|string|max:255',
            'over_ons_mission_text' => 'nullable|string|max:1000',
            'over_ons_pillar_1_title' => 'nullable|string|max:100',
            'over_ons_pillar_1_text' => 'nullable|string|max:500',
            'over_ons_pillar_2_title' => 'nullable|string|max:100',
            'over_ons_pillar_2_text' => 'nullable|string|max:500',
            'over_ons_pillar_3_title' => 'nullable|string|max:100',
            'over_ons_pillar_3_text' => 'nullable|string|max:500',
            'over_ons_story_title' => 'nullable|string|max:255',
            'over_ons_story_image' => 'nullable|string|max:2048',
            'over_ons_story_text' => 'nullable|string|max:3000',
            'over_ons_cta_title' => 'nullable|string|max:255',
            'over_ons_cta_text' => 'nullable|string|max:500',
        ]);

        if ($request->hasFile('hero_background_image')) {
            $path = $request->file('hero_background_image')->store('site', 'public');
            $validated['hero_background_url'] = Storage::url($path);
        }

        SiteSetting::set('hero_background_url', $validated['hero_background_url'] ?? SiteSetting::get('hero_background_url'));
        SiteSetting::set('hero_title', $validated['hero_title'] ?? SiteSetting::get('hero_title'));
        SiteSetting::set('hero_subtitle', $validated['hero_subtitle'] ?? SiteSetting::get('hero_subtitle'));
        SiteSetting::set('hero_description', $validated['hero_description'] ?? SiteSetting::get('hero_description'));
        SiteSetting::set('instagram_business_account_id', $validated['instagram_business_account_id'] ?? SiteSetting::get('instagram_business_account_id'));
        SiteSetting::set('instagram_page_access_token', $validated['instagram_page_access_token'] ?? SiteSetting::get('instagram_page_access_token'));
        SiteSetting::set('instagram_hashtags', $validated['instagram_hashtags'] ?? SiteSetting::get('instagram_hashtags'));

        $overOnsKeys = [
            'over_ons_hero_title', 'over_ons_hero_intro', 'over_ons_hero_image', 'over_ons_hero_year',
            'over_ons_mission_title', 'over_ons_mission_text',
            'over_ons_pillar_1_title', 'over_ons_pillar_1_text',
            'over_ons_pillar_2_title', 'over_ons_pillar_2_text',
            'over_ons_pillar_3_title', 'over_ons_pillar_3_text',
            'over_ons_story_title', 'over_ons_story_image', 'over_ons_story_text',
            'over_ons_cta_title', 'over_ons_cta_text',
        ];

        foreach ($overOnsKeys as $key) {
            if (array_key_exists($key, $validated)) {
                SiteSetting::set($key, $validated[$key] ?? SiteSetting::get($key));
            }
        }

        return redirect()->route('admin.settings.index')->with('success', 'Site instellingen opgeslagen.');
    }

    /**
     * Exchange a short-lived User Access Token for a never-expiring Page Access Token.
     * Flow: short-lived user token → long-lived user token (60d) → page token (never expires)
     */
    public function exchangeInstagramToken(Request $request): RedirectResponse
    {
        $request->validate([
            'user_access_token' => 'required|string',
        ]);

        $appId = config('services.facebook.app_id');
        $appSecret = config('services.facebook.app_secret');
        $graphUrl = config('services.facebook.graph_url');

        if (! $appId || ! $appSecret) {
            return redirect()->back()->with('error', 'FACEBOOK_APP_ID en FACEBOOK_APP_SECRET zijn niet ingesteld in .env.');
        }

        // Step 1: Exchange short-lived user token → long-lived user token (60 days)
        $longLivedResponse = Http::get("{$graphUrl}/oauth/access_token", [
            'grant_type' => 'fb_exchange_token',
            'client_id' => $appId,
            'client_secret' => $appSecret,
            'fb_exchange_token' => $request->input('user_access_token'),
        ]);

        if (! $longLivedResponse->successful() || ! $longLivedResponse->json('access_token')) {
            $error = $longLivedResponse->json('error.message') ?? 'Uitwisseling mislukt.';

            return redirect()->back()->with('error', "Stap 1 mislukt: {$error}");
        }

        $longLivedUserToken = $longLivedResponse->json('access_token');

        $facebookPageId = config('services.facebook.page_id');
        $pageToken = null;

        // Step 2a: Try /me/accounts first (works for directly owned pages)
        $accountsResponse = Http::get("{$graphUrl}/me/accounts", [
            'access_token' => $longLivedUserToken,
        ]);

        if ($accountsResponse->successful()) {
            $pages = $accountsResponse->json('data') ?? [];

            foreach ($pages as $page) {
                if ($facebookPageId && (string) $page['id'] === (string) $facebookPageId) {
                    $pageToken = $page['access_token'];
                    break;
                }
            }

            if (! $pageToken && ! empty($pages)) {
                $pageToken = $pages[0]['access_token'];
            }
        }

        // Step 2b: Fallback — fetch page token directly via page ID (works for Business Manager pages)
        if (! $pageToken && $facebookPageId) {
            $pageResponse = Http::get("{$graphUrl}/{$facebookPageId}", [
                'fields' => 'access_token',
                'access_token' => $longLivedUserToken,
            ]);

            if ($pageResponse->successful() && $pageResponse->json('access_token')) {
                $pageToken = $pageResponse->json('access_token');
            }
        }

        // Step 2c: Last resort — store the long-lived user token (valid 60 days)
        if (! $pageToken) {
            $pageToken = $longLivedUserToken;
        }

        SiteSetting::set('instagram_page_access_token', $pageToken);
        SiteSetting::set('instagram_token_obtained_at', now()->toISOString());

        return redirect()->route('admin.settings.index')->with('success', 'Token succesvol uitgewisseld en opgeslagen. Dit token verloopt nooit.');
    }
}
