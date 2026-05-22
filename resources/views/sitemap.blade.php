<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

    <!-- Statische pagina's -->
    <url>
        <loc>{{ url('/') }}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
        <lastmod>{{ now()->toAtomString() }}</lastmod>
    </url>
    <url>
        <loc>{{ url('/over-ons') }}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>{{ url('/contact') }}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>{{ url('/uitjes') }}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>

    <!-- Locaties -->
    <url>
        <loc>{{ url('/locaties') }}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
        <lastmod>{{ now()->toAtomString() }}</lastmod>
    </url>
    @foreach ($venues as $venue)
    <url>
        <loc>{{ url('/locaties/' . $venue->slug) }}</loc>
        <lastmod>{{ $venue->updated_at->toAtomString() }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    @endforeach

    <!-- Uitjes -->
    @foreach ($outings as $outing)
    <url>
        <loc>{{ url('/uitjes/' . $outing->slug) }}</loc>
        <lastmod>{{ ($outing->updated_at ?? $outing->published_at)->toAtomString() }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    @endforeach

</urlset>
