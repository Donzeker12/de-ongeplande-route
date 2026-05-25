<?php

namespace App\Services;

use App\Models\Outing;
use App\Models\SiteSetting;
use App\Models\SocialSnippet;
use App\Models\Story;
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
     * Post any image to Instagram with a custom caption.
     * The image URL must be publicly accessible.
     */
    public function postToInstagram(string $imageUrl, string $caption): array
    {
        $accountId = SiteSetting::get('instagram_business_account_id') ?? config('services.instagram.business_account_id');
        $accessToken = SiteSetting::get('instagram_page_access_token') ?? config('services.instagram.page_access_token');

        if (! $accountId || ! $accessToken) {
            return ['success' => false, 'error' => 'Instagram-instellingen niet geconfigureerd.'];
        }

        $graphUrl = config('services.instagram.graph_url');

        // Step 1: Create media container
        $containerResponse = Http::post("{$graphUrl}/{$accountId}/media", [
            'image_url' => $imageUrl,
            'caption' => $caption,
            'access_token' => $accessToken,
        ]);

        if (! $containerResponse->successful()) {
            $error = $containerResponse->json('error.message') ?? $containerResponse->body();
            Log::error('Instagram media container failed', ['status' => $containerResponse->status(), 'body' => $containerResponse->body()]);

            return ['success' => false, 'error' => $error];
        }

        $creationId = $containerResponse->json('id');

        // Step 2: Publish the media container
        $publishResponse = Http::post("{$graphUrl}/{$accountId}/media_publish", [
            'creation_id' => $creationId,
            'access_token' => $accessToken,
        ]);

        if ($publishResponse->successful()) {
            return ['success' => true, 'post_id' => $publishResponse->json('id')];
        }

        $error = $publishResponse->json('error.message') ?? $publishResponse->body();
        Log::error('Instagram media_publish failed', ['status' => $publishResponse->status(), 'body' => $publishResponse->body()]);

        return ['success' => false, 'error' => $error];
    }

    /**
     * Share an outing to Instagram Business account.
     * Requires a publicly accessible featured_image URL.
     */
    public function shareToInstagram(Outing $outing): bool
    {
        $accountId = SiteSetting::get('instagram_business_account_id') ?? config('services.instagram.business_account_id');
        $accessToken = SiteSetting::get('instagram_page_access_token') ?? config('services.instagram.page_access_token');

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
        $lines[] = SiteSetting::get('instagram_hashtags') ?? '#deongeplanderoute #uitjemet #weekenduitje #gezinsuitje #nederlandseblog';

        return implode("\n", $lines);
    }

    /**
     * Share a story to Instagram Business account.
     * Requires a publicly accessible featured_image URL.
     */
    public function shareStoryToInstagram(Story $story): bool
    {
        $accountId = SiteSetting::get('instagram_business_account_id') ?? config('services.instagram.business_account_id');
        $accessToken = SiteSetting::get('instagram_page_access_token') ?? config('services.instagram.page_access_token');

        if (! $accountId || ! $accessToken) {
            Log::warning('Instagram credentials not configured.');

            return false;
        }

        if (! $story->featured_image) {
            Log::warning('Instagram post skipped: story has no featured image.', ['story_id' => $story->id]);

            return false;
        }

        $caption = $this->buildStoryInstagramCaption($story);
        $graphUrl = config('services.instagram.graph_url');

        // Step 1: Create media container
        $containerResponse = Http::post("{$graphUrl}/{$accountId}/media", [
            'image_url' => $story->featured_image,
            'caption' => $caption,
            'access_token' => $accessToken,
        ]);

        if (! $containerResponse->successful()) {
            Log::error('Instagram media container failed (story)', [
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
                'outing_id' => null,
                'story_id' => $story->id,
                'platform' => 'instagram',
                'hook_text' => substr($caption, 0, 150),
                'caption' => $caption,
                'teaser_content' => $story->featured_image,
                'published_at' => now(),
            ]);

            return true;
        }

        Log::error('Instagram media_publish failed (story)', [
            'status' => $publishResponse->status(),
            'body' => $publishResponse->body(),
        ]);

        return false;
    }

    /**
     * Build a natural Dutch caption for a story on Instagram.
     */
    private function buildStoryInstagramCaption(Story $story): string
    {
        $lines = [];
        $lines[] = "✨ {$story->title}";
        $lines[] = '';

        if ($story->description) {
            $lines[] = $story->description;
            $lines[] = '';
        }

        $lines[] = '🔗 Link in bio!';
        $lines[] = '';
        $lines[] = SiteSetting::get('instagram_hashtags') ?? '#deongeplanderoute #reisverhaal #weekenduitje #nederlandseblog';

        return implode("\n", $lines);
    }
}
