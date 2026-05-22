<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Outing extends Model
{
    /** @use HasFactory<\Database\Factories\OutingFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'story',
        'location',
        'city',
        'price_info',
        'price_details',
        'mood',
        'featured_image',
        'images',
        'is_recommended',
        'is_free',
        'category',
        'category_id',
        'venue_id',
        'visit_date',
        'published_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'images' => 'array',
            'price_details' => 'array',
            'is_recommended' => 'boolean',
            'is_free' => 'boolean',
            'visit_date' => 'date',
            'published_at' => 'datetime',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Outing $outing) {
            if (empty($outing->slug)) {
                $outing->slug = Str::slug($outing->title);
            }
        });
    }

    /**
     * Get the discoveries for the outing.
     */
    public function discoveries(): HasMany
    {
        return $this->hasMany(Discovery::class);
    }

    public function socialSnippets(): HasMany
    {
        return $this->hasMany(SocialSnippet::class);
    }

    public function categoryModel(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }
}
