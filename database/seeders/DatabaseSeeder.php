<?php

namespace Database\Seeders;

use App\Models\Discovery;
use App\Models\Outing;
use App\Models\User;
use Illuminate\Database\Seeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Leeg de tabellen zodat de seeder opnieuw gedraaid kan worden
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        Discovery::truncate();
        Outing::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // Create admin users (jij en je vrouw)
        User::updateOrCreate(
            ['email' => 'admin@deongeplande-route.nl'],
            [
                'name' => 'Admin',
                'password' => bcrypt('password'), // Verander dit later!
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin2@deongeplande-route.nl'],
            [
                'name' => 'Admin 2',
                'password' => bcrypt('password'), // Verander dit later!
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        // Artis
        $artis = Outing::create([
            'title' => 'Artis',
            'slug' => 'artis',
            'story' => 'Een dag vol ontdekkingen in het hart van Amsterdam. De kinderen waren direct weg van de apen, en wij genoten van de rust bij het aquarium. Artis blijft altijd een aanrader voor een spontaan dagje uit – geen plan nodig, gewoon lopen en kijken waar je uitkomt.',
            'location' => 'Plantage Kerklaan 38-40',
            'city' => 'Amsterdam',
            'price_info' => 'vanaf €29,50',
            'mood' => 'ontspannen',
            'featured_image' => 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800',
            'images' => [
                'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400',
                'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400',
                'https://images.unsplash.com/photo-1551947879-2c3a4e354e66?w=400',
            ],
            'is_recommended' => false,
            'is_free' => false,
            'category' => 'Dierentuin',
            'visit_date' => now()->subDays(14),
            'published_at' => now(),
        ]);

        Discovery::create([
            'outing_id' => $artis->id,
            'title' => '3 Grijspitsmuis',
            'type' => 'dier',
            'description' => 'De kleinste zoogdieren van Nederland! Deze piepkleine muisjes zijn bijna zo groot als je duim.',
            'image' => 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=200',
        ]);

        Discovery::create([
            'outing_id' => $artis->id,
            'title' => 'Zwartekuifmakaak',
            'type' => 'dier',
            'description' => 'Deze aapjes hebben de meest grappige kapsels! De kinderen konden er niet genoeg van krijgen.',
            'image' => 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=200',
        ]);

        Discovery::create([
            'outing_id' => $artis->id,
            'title' => 'Grote Mara',
            'type' => 'dier',
            'description' => 'Deze grote knaagdieren lijken op een mix tussen een haas en een hert. Super bijzonder!',
            'image' => 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=200',
        ]);

        // Rommelmarkt Nijmegen
        $rommelmarkt = Outing::create([
            'title' => 'Rommelmarkt Nijmegen',
            'slug' => 'rommelmarkt-nijmegen',
            'story' => 'Elke zondagochtend vind je hier schatten tussen de rommel. De kinderen vonden oude speelgoed, wij vonden mooie vintage kopjes. De sfeer is altijd gezellig, en voor een paar euro ben je al blij.',
            'location' => 'Waalkade',
            'city' => 'Nijmegen',
            'price_info' => 'Gratis',
            'mood' => 'gezellig',
            'featured_image' => 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800',
            'images' => [
                'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=400',
                'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400',
            ],
            'is_recommended' => true,
            'is_free' => true,
            'category' => 'Rommelmarkt',
            'visit_date' => now()->subDays(7),
            'published_at' => now(),
        ]);

        Discovery::create([
            'outing_id' => $rommelmarkt->id,
            'title' => '1 ontdekkingen',
            'type' => 'weetje',
            'description' => 'De markt bestaat al meer dan 40 jaar en trekt elke week honderden bezoekers!',
            'image' => 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=200',
        ]);

        Discovery::create([
            'outing_id' => $rommelmarkt->id,
            'title' => 'Ontdekkens',
            'type' => 'plek',
            'description' => 'Vergeet niet te onderhandelen – dat hoort erbij!',
            'image' => 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=200',
        ]);

        Discovery::create([
            'outing_id' => $rommelmarkt->id,
            'title' => 'Grote Mara',
            'type' => 'weetje',
            'description' => 'Kom vroeg voor de beste vondsten – tegen de middag is het meeste al weg.',
            'image' => 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=200',
        ]);

        // Wildlands Adventure Zoo
        $wildlands = Outing::create([
            'title' => 'Wildlands Adventure Zoo',
            'slug' => 'wildlands-adventure-zoo',
            'story' => 'Van de Afrikaanse savanne tot het regenwoud, het voelt alsof je echt op reis bent. De kinderen vonden de vlindertuin magisch, en wij werden verrast door de ijsberen. Een hele dag vol avontuur!',
            'location' => 'Raadhuisplein 99',
            'city' => 'Emmen',
            'price_info' => 'vanaf €30 p.p.',
            'mood' => 'avontuurlijk',
            'featured_image' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
            'images' => [
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
                'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
            ],
            'is_recommended' => true,
            'is_free' => false,
            'category' => 'Dierentuin',
            'visit_date' => now()->subDays(21),
            'published_at' => now(),
        ]);

        Discovery::create([
            'outing_id' => $wildlands->id,
            'title' => 'Baby olifantjes',
            'type' => 'dier',
            'description' => 'We hadden geluk! Er liepen twee baby olifantjes rond die nog aan het leren waren om hun slurf te gebruiken.',
            'image' => 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=200',
        ]);

        // Kasteel De Haar
        $kasteel = Outing::create([
            'title' => 'Kasteel De Haar',
            'slug' => 'kasteel-de-haar',
            'story' => 'Een sprookjeskasteel in eigen land. De torens, de ophaalbrug, de prachtige tuinen – alles is net echt. De kinderen waanden zich ridders en prinsessen, wij genoten van de architectuur en rust. Perfect voor een middagje terugreizen in de tijd.',
            'location' => 'Kasteellaan 1',
            'city' => 'Haarzuilens',
            'price_info' => 'vanaf €19 p.p.',
            'mood' => 'leerzaam',
            'featured_image' => 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
            'images' => [
                'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400',
                'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
            ],
            'is_recommended' => true,
            'is_free' => false,
            'category' => 'Duitsland',
            'visit_date' => now()->subDays(35),
            'published_at' => now(),
        ]);

        // Wandelen in de Veluwe
        $veluwe = Outing::create([
            'title' => 'Wandelen in de Veluwe',
            'slug' => 'wandelen-in-de-veluwe',
            'story' => 'Soms is het beste uitje gewoon… lopen. Geen doel, geen plan. We liepen door het bos, vonden een beekje, zagen een ree in de verte. De kinderen bouwden een hut, wij dronken koffie uit de thermosfles. Simpel en perfect.',
            'location' => 'Nationaal Park De Hoge Veluwe',
            'city' => 'Gelderland',
            'price_info' => 'Gratis',
            'mood' => 'rustig',
            'featured_image' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
            'images' => [
                'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
                'https://images.unsplash.com/photo-1511497584788-876760111969?w=400',
            ],
            'is_recommended' => true,
            'is_free' => true,
            'category' => 'Gratis',
            'visit_date' => now()->subDays(3),
            'published_at' => now(),
        ]);

        Discovery::create([
            'outing_id' => $veluwe->id,
            'title' => 'Slurfspitsmuis',
            'type' => 'dier',
            'description' => 'Deze kleine beestjes hebben een soort mini-slurf! Als je stil bent, kun je ze misschien horen ritselen in de bladeren.',
            'image' => 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=200',
        ]);

        // Burgers' Zoo
        $burgers = Outing::create([
            'title' => "Burgers' Zoo",
            'slug' => 'burgers-zoo',
            'story' => 'De jungle van Burgers\' Bush voelt echt tropisch aan! Hier loop je tussen de vlinders, hoor je de apen krijsen en ruik je de jungle. De kids vonden de hagediswandeling in de Desert fantastisch. Een dagje vakantiegevoel in eigen land.',
            'location' => 'Antoon van Hooffplein 1',
            'city' => 'Arnhem',
            'price_info' => 'vanaf €26 p.p.',
            'mood' => 'avontuurlijk',
            'featured_image' => 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800',
            'images' => [
                'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400',
                'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
                'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400',
            ],
            'is_recommended' => true,
            'is_free' => false,
            'category' => 'Dierentuin',
            'visit_date' => now()->subDays(28),
            'published_at' => now(),
        ]);

        Discovery::create([
            'outing_id' => $burgers->id,
            'title' => 'Kameleons',
            'type' => 'dier',
            'description' => 'In de Desert zie je kameleons die van kleur veranderen! Sommige zijn zo klein als je duim.',
            'image' => 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=200',
        ]);

        Discovery::create([
            'outing_id' => $burgers->id,
            'title' => 'Vlindertuin',
            'type' => 'plek',
            'description' => 'In de Bush vlieg je tussen tropische vlinders die groter zijn dan je hand!',
            'image' => 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200',
        ]);

        // Ouwehands Dierenpark
        $ouwehands = Outing::create([
            'title' => 'Ouwehands Dierenpark',
            'slug' => 'ouwehands-dierenpark',
            'story' => 'De grote panda\'s zijn natuurlijk de sterren, maar vergeet de rest niet! De giraffen kijken je vriendelijk aan, de pinguïns duiken vrolijk rond en bij de beren was voedertijd - wat een actie! Een echt familieparkje waar iedereen zich thuis voelt.',
            'location' => 'Grebbeweg 111',
            'city' => 'Rhenen',
            'price_info' => 'vanaf €24,50 p.p.',
            'mood' => 'gezellig',
            'featured_image' => 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
            'images' => [
                'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400',
                'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400',
                'https://images.unsplash.com/photo-1551947879-2c3a4e354e66?w=400',
            ],
            'is_recommended' => false,
            'is_free' => false,
            'category' => 'Dierentuin',
            'visit_date' => now()->subDays(42),
            'published_at' => now(),
        ]);

        Discovery::create([
            'outing_id' => $ouwehands->id,
            'title' => 'Panda Wu Wen',
            'type' => 'dier',
            'description' => 'Deze grote panda eet 14 uur per dag bamboe! We hadden geluk en zagen hem spelen.',
            'image' => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200',
        ]);

        Discovery::create([
            'outing_id' => $ouwehands->id,
            'title' => 'Humboldt pinguïns',
            'type' => 'dier',
            'description' => 'Deze pinguïns zwemmen razendsnel! Ze kunnen wel 32 km/u halen onder water.',
            'image' => 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200',
        ]);

        // Kinderdijk
        $kinderdijk = Outing::create([
            'title' => 'Molens van Kinderdijk',
            'slug' => 'molens-van-kinderdijk',
            'story' => 'Fietsend langs de molens voelt als een reis door de tijd. De kinderen telden alle 19 molens en we klommen naar boven in molen Blokweer. Het uitzicht over de polder is adembenemend - hier snap je pas hoe bijzonder Nederland is.',
            'location' => 'Nederwaard 1',
            'city' => 'Kinderdijk',
            'price_info' => 'vanaf €9 p.p.',
            'mood' => 'leerzaam',
            'featured_image' => 'https://images.unsplash.com/photo-1573241485837-49e4b67af7b9?w=800',
            'images' => [
                'https://images.unsplash.com/photo-1573241485837-49e4b67af7b9?w=400',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            ],
            'is_recommended' => true,
            'is_free' => false,
            'category' => 'Cultuur',
            'visit_date' => now()->subDays(56),
            'published_at' => now(),
        ]);

        Discovery::create([
            'outing_id' => $kinderdijk->id,
            'title' => 'Watermolen',
            'type' => 'weetje',
            'description' => 'Deze molens draaien al 1000 jaar! Ze hielden de voeten van onze voorouders droog.',
            'image' => 'https://images.unsplash.com/photo-1573241485837-49e4b67af7b9?w=200',
        ]);

        // Strand Scheveningen
        $strand = Outing::create([
            'title' => 'Strand Scheveningen',
            'slug' => 'strand-scheveningen',
            'story' => 'Spontaan naar zee! De wind door je haar, zand tussen je tenen, de kinderen rennen naar de golven en rennen weer weg. We hebben zandkastelen gebouwd, patat gegeten en zeewier gevonden. Soms is het beste dagje uit het simpelste.',
            'location' => 'Boulevard de Thorbeckeplein',
            'city' => 'Scheveningen',
            'price_info' => 'Gratis (parkeren betaald)',
            'mood' => 'ontspannen',
            'featured_image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
            'images' => [
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
                'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
                'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
            ],
            'is_recommended' => false,
            'is_free' => true,
            'category' => 'Strand',
            'visit_date' => now()->subDays(10),
            'published_at' => now(),
        ]);

        Discovery::create([
            'outing_id' => $strand->id,
            'title' => 'Zeesterren',
            'type' => 'dier',
            'description' => 'Bij eb vind je soms kleine zeesterren tussen de stenen van de pieren!',
            'image' => 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=200',
        ]);

        Discovery::create([
            'outing_id' => $strand->id,
            'title' => 'Pier van Scheveningen',
            'type' => 'plek',
            'description' => 'Loop tot het einde van de pier en kijk terug naar Nederland - een bijzonder perspectief!',
            'image' => 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200',
        ]);

        // Het Vondelpark
        $vondelpark = Outing::create([
            'title' => 'Vondelpark Amsterdam',
            'slug' => 'vondelpark-amsterdam',
            'story' => 'Midden in de drukte van Amsterdam vind je opeens deze groene oase. We voerden de eenden (hoewel dat eigenlijk niet mag), keken naar de speeltuin vol Amsterdamse kinderen en dronken koffie bij het theehuis. Gratis vertier in de hoofdstad.',
            'location' => 'Vondelpark',
            'city' => 'Amsterdam',
            'price_info' => 'Gratis',
            'mood' => 'gezellig',
            'featured_image' => 'https://images.unsplash.com/photo-1566404791232-af9fe0ae8f8b?w=800',
            'images' => [
                'https://images.unsplash.com/photo-1566404791232-af9fe0ae8f8b?w=400',
                'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
            ],
            'is_recommended' => false,
            'is_free' => true,
            'category' => 'Park',
            'visit_date' => now()->subDays(4),
            'published_at' => now(),
        ]);

        Discovery::create([
            'outing_id' => $vondelpark->id,
            'title' => 'Halsbandparkiet',
            'type' => 'dier',
            'description' => 'Kijk omhoog! In de bomen leven felgroene papegaaien die oorspronkelijk uit India komen.',
            'image' => 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=200',
        ]);

        // Speelgoedmuseum Deventer
        $speelgoedmuseum = Outing::create([
            'title' => 'Speelgoedmuseum Deventer',
            'slug' => 'speelgoedmuseum-deventer',
            'story' => 'Wie zegt dat musea saai zijn? Hier mocht alles aangeraakt, bespeeld en uitgeprobeerd worden! Van eeuwenoud houten speelgoed tot moderne games. De kinderen waren druk bezig, wij werden nostalgisch van het oude LEGO.',
            'location' => 'Brink 47',
            'city' => 'Deventer',
            'price_info' => 'vanaf €8 p.p.',
            'mood' => 'nostalgisch',
            'featured_image' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
            'images' => [
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
                'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
            ],
            'is_recommended' => true,
            'is_free' => false,
            'category' => 'Museum',
            'visit_date' => now()->subDays(17),
            'published_at' => now(),
        ]);

        Discovery::create([
            'outing_id' => $speelgoedmuseum->id,
            'title' => 'Knikkers van glas',
            'type' => 'weetje',
            'description' => 'De eerste knikkers werden gemaakt van klei, later van glas. Sommige antieke knikkers zijn nu meer waard dan goud!',
            'image' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
        ]);

        // Extra uitjes voor de homepagina vulling
        Outing::factory(3)->create([
            'is_recommended' => false,
            'published_at' => now(),
        ])->each(function ($outing) {
            Discovery::factory(2)->create([
                'outing_id' => $outing->id,
            ]);
        });
    }
}
