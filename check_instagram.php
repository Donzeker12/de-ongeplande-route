<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$token = App\Models\SiteSetting::get('instagram_page_access_token');
$accountId = App\Models\SiteSetting::get('instagram_business_account_id');
$creationId = '18086820044085945'; // laatste container ID

echo "=== Instagram Diagnostic ===\n";
echo "Account ID: " . ($accountId ?: 'NIET INGESTELD') . "\n";
echo "Token: " . ($token ? substr($token, 0, 20) . '...' : 'NIET INGESTELD') . "\n\n";

if ($token && $creationId) {
    // Check container status
    $resp = Illuminate\Support\Facades\Http::get("https://graph.facebook.com/v21.0/{$creationId}", [
        'fields' => 'status_code,status',
        'access_token' => $token,
    ]);
    echo "Container status response:\n";
    echo $resp->body() . "\n\n";

    // Check token debug
    $appId = config('services.facebook.app_id');
    $appSecret = config('services.facebook.app_secret');
    if ($appId && $appSecret) {
        $debug = Illuminate\Support\Facades\Http::get("https://graph.facebook.com/debug_token", [
            'input_token' => $token,
            'access_token' => $appId . '|' . $appSecret,
        ]);
        echo "Token debug:\n";
        $data = $debug->json('data');
        echo "  Geldig: " . ($data['is_valid'] ? 'JA' : 'NEE') . "\n";
        if (isset($data['expires_at'])) {
            echo "  Verloopt: " . ($data['expires_at'] == 0 ? 'NOOIT' : date('Y-m-d', $data['expires_at'])) . "\n";
        }
        echo "  Scopes: " . implode(', ', $data['scopes'] ?? []) . "\n";
    }
}

// Check for http:// URLs in database
$httpCount = App\Models\Media::where('url', 'LIKE', 'http://%')->count();
$httpsCount = App\Models\Media::where('url', 'LIKE', 'https://%')->count();
echo "\nMedia URLs in database:\n";
echo "  HTTP:  " . $httpCount . "\n";
echo "  HTTPS: " . $httpsCount . "\n";

// Update http:// to https:// in bulk
if ($httpCount > 0) {
    $updated = App\Models\Media::where('url', 'LIKE', 'http://%')
        ->update(['url' => \Illuminate\Support\Facades\DB::raw("REPLACE(url, 'http://', 'https://')")]);
    echo "  Bijgewerkt naar HTTPS: " . $updated . "\n";
}

// Check last media URL
$media = App\Models\Media::where('mime_type', 'LIKE', 'image/%')->latest()->first();
if ($media) {
    echo "\nLaatste media URL: " . $media->url . "\n";
    echo "MIME type: " . $media->mime_type . "\n";
    $test = Illuminate\Support\Facades\Http::timeout(10)->get($media->url);
    echo "URL bereikbaar: " . ($test->successful() ? 'JA (HTTP ' . $test->status() . ')' : 'NEE (HTTP ' . $test->status() . ')') . "\n";
}
