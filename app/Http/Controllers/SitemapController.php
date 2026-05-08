<?php

namespace App\Http\Controllers;

use App\Models\Outing;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $outings = Outing::query()
            ->whereNotNull('published_at')
            ->select(['slug', 'updated_at', 'published_at'])
            ->latest('published_at')
            ->get();

        $content = view('sitemap', ['outings' => $outings])->render();

        return response($content, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
