<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SocialSnippet>
 */
class SocialSnippetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'platform' => fake()->randomElement(['tiktok', 'instagram', 'facebook']),
            'hook_text' => 'Dit hadden we niet verwacht! '.fake()->emoji(),
            'caption' => fake()->sentence(10).' #geenplan #welverhalen #familieuitje',
            'teaser_content' => fake()->paragraph(),
            'published_at' => fake()->boolean(50) ? fake()->dateTimeBetween('-1 month', 'now') : null,
        ];
    }
}
