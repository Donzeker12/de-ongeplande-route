<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Story extends Model
{
    /** @use HasFactory<\Database\Factories\StoryFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'generated_content',
        'youtube_url',
        'featured_image',
        'status',
        'user_id',
        'ai_settings',
        'published_at',
    ];

    protected $casts = [
        'ai_settings' => 'array',
        'published_at' => 'datetime',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Story $story) {
            if (empty($story->slug)) {
                $story->slug = Str::slug($story->title);
            }
        });

        static::updating(function (Story $story) {
            if ($story->isDirty('title') && empty($story->slug)) {
                $story->slug = Str::slug($story->title);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function chapters(): HasMany
    {
        return $this->hasMany(Chapter::class)->orderBy('order');
    }

    public function isPublished(): bool
    {
        return $this->status === 'published' && $this->published_at !== null;
    }

    public function canGenerate(): bool
    {
        return in_array($this->status, ['draft', 'completed']) && $this->chapters()->count() > 0;
    }
}
