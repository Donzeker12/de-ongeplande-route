<?php

namespace App\Services;

use App\Models\Outing;
use App\Models\SocialSnippet;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SocialShareService
{
    /**
     * Share an outing to Facebook page.
     */
    public function shareToFacebook(Outing $outing): bool
    {
        $pageId = config('services.facebook.page_id');
        $accessToken = config('services.facebook.page_access_token');

        if (! $pageId || ! $accessToken) {
            Log::warning('Facebook credentials not configured.');

            return false;
        }

        $message = $this->buildFacebookCaption($outing);
        $siteUrl = config('app.url');
        $postUrl = "{$siteUrl}/uitjes/{$outing->slug}";

        $response = Http::post(
            config('services.facebook.graph_url')."/{$pageId}/feed",
            [
                'message' => $message,
                'link' => $postUrl,
                'access_token' => $accessToken,
            ],
        );

        if ($response->successful()) {
            SocialSnippet::create([
                'outing_id' => $outing->id,
                'platform' => 'facebook',
                'hook_text' => substr($message, 0, 150),
                'caption' => $message,
                'teaser_content' => $postUrl,
                'published_at' => now(),
            ]);

            return true;
        }

        Log::error('Facebook post failed', [
            'status' => $response->status(),
            'body' => $response->body(),
        ]);

        return false;
    }

    /**
     * Share an outing to Instagram Business account.
     * Requires a publicly accessible featured_image URL.
     */
    public function shareToInstagram(Outing $outing): bool
    {
        $accountId = config('services.instagram.business_account_id');
        $accessToken = config('services.instagram.page_access_token');

        if (! $accountId || ! $accessToken) {
            Log::warning('Instagram credentials not configured.');

            return false;
        }

        if (! $outing->featured_image) {
            Log::warning('Instagram post skipped: outing has no featured image.', ['outing_id' => $outing->id]);

            return false;
        }

        $caption = $this->buildInstagramCaption($outing);
        $graphUrl = config('services.instagram.graph_url');

        // Step 1: Create media container
        $containerResponse = Http::post("{$graphUrl}/{$accountId}/media", [
            'image_url' => $outing->featured_image,
            'caption' => $caption,
            'access_token' => $accessToken,
        ]);

        if (! $containerResponse->successful()) {
            Log::error('Instagram media container failed', [
                'status' => $containerResponse->status(),
                'body' => $containerResponse->body(),
            ]);

            return false;
        }

        $creationId = $containerResponse->json('id');

        // Step 2: Publish the media container
        $publishResponse = Http::post("{$graphUrl}/{$accountId}/media_publish", [
            'creation_id' => $creationId,
            'access_token' => $accessToken,
        ]);

        if ($publishResponse->successful()) {
            SocialSnippet::create([
                'outing_id' => $outing->id,
                'platform' => 'instagram',
                'hook_text' => substr($caption, 0, 150),
                'caption' => $caption,
                'teaser_content' => $outing->featured_image,
                'published_at' => now(),
            ]);

            return true;
        }

        Log::error('Instagram media_publish failed', [
            'status' => $publishResponse->status(),
            'body' => $publishResponse->body(),
        ]);

        return false;
    }

    /**
     * Build a natural Dutch caption for Facebook.
     */
    private function buildFacebookCaption(Outing $outing): string
    {
        $lines = [];
        $lines[] = "✨ {$outing->title}";
        $lines[] = '';

        if ($outing->city) {
            $lines[] = "📍 {$outing->city}";
        }

        if ($outing->mood) {
            $lines[] = "💬 {$outing->mood}";
        }

        $lines[] = '';
        $lines[] = 'Lees het hele verhaal op de website! 👇';

        return implode("\n", $lines);
    }

    /**
     * Build a natural Dutch caption for Instagram.
     */
    private function buildInstagramCaption(Outing $outing): string
    {
        $lines = [];
        $lines[] = "✨ {$outing->title}";
        $lines[] = '';

        if ($outing->mood) {
            $lines[] = $outing->mood;
            $lines[] = '';
        }

        if ($outing->city) {
            $lines[] = "📍 {$outing->city}";
        }

        $lines[] = '';
        $lines[] = '🔗 Link in bio!';
        $lines[] = '';
        $lines[] = '#deongeplanderoute #uitjemet #weekenduitje #gezinsuitje #nederlandseblog';

        return implode("\n", $lines);
    }
}
