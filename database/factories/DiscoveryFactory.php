<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Discovery>
 */
class DiscoveryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['dier', 'plek', 'weetje']);

        $titles = [
            'dier' => ['Zwartekuifmakaak', 'Baby olifantjes', 'Grote Mara', 'Slurfspitsmuis', 'Geitjes'],
            'plek' => ['Speeltuin', 'Picknickveld', 'Boswandeling', 'Waterval'],
            'weetje' => ['Historisch verhaal', 'Leuk weetje', 'Interessant feit'],
        ];

        return [
            'title' => fake()->randomElement($titles[$type]),
            'type' => $type,
            'description' => fake()->sentence(12),
            'image' => 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=200',
        ];
    }
}
