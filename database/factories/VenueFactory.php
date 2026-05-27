<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Venue>
 */
class VenueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'slug' => fake()->unique()->slug(),
            'type' => array_rand(array_flip(array_keys(\App\Models\Venue::$types))),
            'description' => fake()->paragraph(),
            'city' => fake()->city(),
            'country' => 'Nederland',
            'address' => fake()->streetAddress(),
            'website' => 'https://example.com',
            'featured_image' => 'https://example.com/image.jpg',
        ];
    }
}
