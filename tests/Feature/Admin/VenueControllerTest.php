<?php

use App\Models\User;
use App\Models\Venue;

beforeEach(function () {
    $this->admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($this->admin);
});

test('update saves locatie fields correctly', function () {
    $venue = Venue::factory()->create([
        'city' => null,
        'address' => null,
        'website' => null,
        'featured_image' => null,
    ]);

    $this->patch("/admin/venues/{$venue->id}", [
        'name' => $venue->name,
        'type' => $venue->type,
        'city' => 'Amsterdam',
        'country' => 'Nederland',
        'address' => 'Plantage Kerklaan 38-40',
        'website' => 'https://www.artis.nl',
        'featured_image' => 'https://example.com/image.jpg',
    ])->assertRedirect(route('admin.venues.index'));

    $venue->refresh();

    expect($venue->city)->toBe('Amsterdam')
        ->and($venue->country)->toBe('Nederland')
        ->and($venue->address)->toBe('Plantage Kerklaan 38-40')
        ->and($venue->website)->toBe('https://www.artis.nl')
        ->and($venue->featured_image)->toBe('https://example.com/image.jpg');
});

test('update fails with invalid website url', function () {
    $venue = Venue::factory()->create();

    $this->patch("/admin/venues/{$venue->id}", [
        'name' => $venue->name,
        'type' => $venue->type,
        'website' => 'not-a-valid-url',
    ])->assertSessionHasErrors('website');
});

test('update saves with empty locatie fields', function () {
    $venue = Venue::factory()->create([
        'city' => 'Utrecht',
        'website' => 'https://example.com',
    ]);

    $this->patch("/admin/venues/{$venue->id}", [
        'name' => $venue->name,
        'type' => $venue->type,
        'city' => '',
        'website' => '',
    ])->assertRedirect(route('admin.venues.index'));

    $venue->refresh();

    expect($venue->city)->toBeNull()
        ->and($venue->website)->toBeNull();
});
