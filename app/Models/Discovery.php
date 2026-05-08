<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Discovery extends Model
{
    /** @use HasFactory<\Database\Factories\DiscoveryFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'outing_id',
        'title',
        'slug',
        'type',
        'description',
        'image',
    ];

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Discovery $discovery) {
            if (empty($discovery->slug)) {
                $discovery->slug = Str::slug($discovery->title);
            }
        });
    }

    /**
     * Get the outing that owns the discovery.
     */
    public function outing(): BelongsTo
    {
        return $this->belongsTo(Outing::class);
    }
}
