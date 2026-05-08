<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialSnippet extends Model
{
    /** @use HasFactory<\Database\Factories\SocialSnippetFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'outing_id',
        'platform',
        'hook_text',
        'caption',
        'teaser_content',
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
            'published_at' => 'datetime',
        ];
    }

    /**
     * Get the outing that owns the social snippet.
     */
    public function outing(): BelongsTo
    {
        return $this->belongsTo(Outing::class);
    }
}
