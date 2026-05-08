<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Venue extends Model
{
    /** @use HasFactory<\Database\Factories\VenueFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'type',
        'description',
        'city',
        'country',
        'address',
        'website',
        'featured_image',
    ];

    /** @var array<string, string[]> */
    public static array $types = [
        'dierentuin'  => ['label' => 'Dierentuin',  'emoji' => '🦁'],
        'pretpark'    => ['label' => 'Pretpark',    'emoji' => '🎡'],
        'winkel'      => ['label' => 'Winkel',      'emoji' => '🛍️'],
        'museum'      => ['label' => 'Museum',      'emoji' => '🏛️'],
        'speeltuin'   => ['label' => 'Speeltuin',   'emoji' => '🎓'],
        'restaurant'  => ['label' => 'Restaurant',  'emoji' => '🍽️'],
        'attractie'   => ['label' => 'Attractie',   'emoji' => '🎟️'],
        'natuur'      => ['label' => 'Natuur',      'emoji' => '🌲'],
        'overig'      => ['label' => 'Overig',      'emoji' => '📍'],
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Venue $venue) {
            if (empty($venue->slug)) {
                $venue->slug = Str::slug($venue->name);
            }
        });
    }

    public function outings(): HasMany
    {
        return $this->hasMany(Outing::class);
    }

    public function getTypeEmojiAttribute(): string
    {
        return self::$types[$this->type]['emoji'] ?? '📍';
    }

    public function getTypeLabelAttribute(): string
    {
        return self::$types[$this->type]['label'] ?? 'Overig';
    }
}
