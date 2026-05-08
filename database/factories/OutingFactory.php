<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Outing>
 */
class OutingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Dierentuin', 'Gratis', 'Rommelmarkt', 'Speeltuin', 'Duitsland', 'België'];
        $moods = ['rustig', 'gezellig', 'druk', 'ontspannen', 'avontuurlijk', 'leerzaam'];
        $cities = ['Amsterdam', 'Nijmegen', 'Utrecht', 'Rotterdam', 'Den Haag', 'Emmen', 'Gelderland'];

        return [
            'title' => fake()->words(3, true),
            'story' => fake()->paragraphs(4, true),
            'location' => fake()->streetAddress(),
            'city' => fake()->randomElement($cities),
            'price_info' => fake()->randomElement(['vanaf €29,50', 'Gratis', 'vanaf €19 p.p.', 'vanaf €30 p.p.']),
            'mood' => fake()->randomElement($moods),
            'featured_image' => 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800',
            'images' => [
                'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400',
                'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400',
            ],
            'is_recommended' => fake()->boolean(30),
            'is_free' => fake()->boolean(20),
            'category' => fake()->randomElement($categories),
            'visit_date' => fake()->dateTimeBetween('-6 months', 'now'),
            'published_at' => now(),
        ];
    }
}
