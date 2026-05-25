<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
\App\Models\SiteSetting::set('instagram_hashtags', '#instagood #travel #photooftheday #familytravel #deongeplanderoute');
echo 'OK: '.(\App\Models\SiteSetting::get('instagram_hashtags')).PHP_EOL;
