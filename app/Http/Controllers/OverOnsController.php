<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class OverOnsController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('OverOns', [
            'content' => [
                'hero_title' => SiteSetting::get('over_ons_hero_title') ?? 'Over Ons',
                'hero_intro' => SiteSetting::get('over_ons_hero_intro') ?? 'Wij zijn een gezin dat van spontaniteit houdt. Geen uitgebreide planningen, geen stress over waar we naartoe gaan. Gewoon instappen en kijken waar de weg ons brengt.',
                'hero_image' => SiteSetting::get('over_ons_hero_image') ?? 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80',
                'hero_year' => SiteSetting::get('over_ons_hero_year') ?? 'Sinds 2023',
                'mission_title' => SiteSetting::get('over_ons_mission_title') ?? 'Onze Missie',
                'mission_text' => SiteSetting::get('over_ons_mission_text') ?? 'We geloven dat de mooiste herinneringen ontstaan wanneer je geen plan hebt. Door onze verhalen te delen, hopen we anderen te inspireren om ook eens spontaan op pad te gaan en hun eigen avonturen te beleven.',
                'pillar_1_title' => SiteSetting::get('over_ons_pillar_1_title') ?? 'Spontaan',
                'pillar_1_text' => SiteSetting::get('over_ons_pillar_1_text') ?? 'Geen uitgebreide plannen, gewoon gaan en onderweg beslissen wat we gaan doen.',
                'pillar_2_title' => SiteSetting::get('over_ons_pillar_2_title') ?? 'Ontdekken',
                'pillar_2_text' => SiteSetting::get('over_ons_pillar_2_text') ?? 'Elk uitje brengt nieuwe ontdekkingen: van kleine details tot grote verrassingen.',
                'pillar_3_title' => SiteSetting::get('over_ons_pillar_3_title') ?? 'Delen',
                'pillar_3_text' => SiteSetting::get('over_ons_pillar_3_text') ?? 'We delen onze verhalen zodat anderen ook kunnen genieten van mooie plekken.',
                'story_title' => SiteSetting::get('over_ons_story_title') ?? 'Hoe Het Begon',
                'story_image' => SiteSetting::get('over_ons_story_image') ?? 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
                'story_text' => SiteSetting::get('over_ons_story_text') ?? "Het begon allemaal met een zaterdagochtend waarop we geen plannen hadden. \"Zullen we gewoon ergens naartoe rijden?\" zeiden we tegen elkaar. De kinderen sprongen enthousiast in de auto en zo begon ons eerste ongeplande avontuur.\n\nWe ontdekten een prachtig kasteel dat we nooit eerder hadden gezien, aten de beste pannenkoeken in een klein dorpscafeetje en vonden een speeltuin waar de kinderen uren konden spelen. Het was perfect.\n\nSinds die dag zijn we regelmatig 'de ongeplande route' gaan rijden. Elke keer ontdekken we weer nieuwe plekjes, maken we mooie herinneringen en komen we thuis met verhalen om te vertellen.",
                'cta_title' => SiteSetting::get('over_ons_cta_title') ?? 'Laat Je Inspireren',
                'cta_text' => SiteSetting::get('over_ons_cta_text') ?? 'Benieuwd naar onze verhalen? Bekijk onze uitjes en misschien inspireren ze jou wel om ook eens spontaan op pad te gaan.',
            ],
        ]);
    }
}
