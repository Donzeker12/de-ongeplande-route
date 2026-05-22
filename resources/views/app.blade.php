<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'De Ongeplande Route') }}</title>

        <!-- PWA -->
        <link rel="manifest" href="/manifest.json">
        <meta name="theme-color" content="#f59e0b">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="apple-mobile-web-app-title" content="Ongeplande Route">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <!-- Default SEO -->
        <meta name="description" content="De Ongeplande Route – een familie die zonder plan op pad gaat. Geen schema, wel verhalen. Ontdek spontane uitjes, eerlijke ervaringen en onverwachte plekken in Nederland.">
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="{{ url()->current() }}">

        <!-- Open Graph defaults -->
        <meta property="og:site_name" content="De Ongeplande Route">
        <meta property="og:locale" content="nl_NL">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="De Ongeplande Route – Geen plan. Wel verhalen.">
        <meta property="og:description" content="Een familie die zonder plan op pad gaat en spontane uitjes deelt.">
        <meta property="og:image" content="{{ asset('build/assets/og-default.jpg') }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">

        <!-- Twitter Card defaults -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="De Ongeplande Route">
        <meta name="twitter:description" content="Geen plan. Wel verhalen. Spontane uitjes van een avontuurlijke familie.">
        <meta name="twitter:image" content="{{ asset('build/assets/og-default.jpg') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
    </body>
</html>
