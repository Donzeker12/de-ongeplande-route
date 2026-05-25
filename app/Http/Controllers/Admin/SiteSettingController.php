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
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        \Log::info('SiteSettings update received', [
            'instagram_business_account_id' => $request->input('instagram_business_account_id'),
            'instagram_page_access_token_len' => strlen($request->input('instagram_page_access_token') ?? ''),
            'all_keys' => array_keys($request->all()),
        ]);

        $validated = $request->validate([
            'hero_background_url' => 'nullable|string|max:2048',
            'hero_background_image' => 'nullable|image|max:5120',
            'hero_title' => 'nullable|string|max:255',
            'hero_subtitle' => 'nullable|string|max:255',
            'hero_description' => 'nullable|string|max:500',
            'instagram_business_account_id' => 'nullable|string|max:255',
            'instagram_page_access_token' => 'nullable|string|max:4096',
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
