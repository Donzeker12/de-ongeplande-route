<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $fillable = ['filename', 'path', 'url', 'mime_type', 'size', 'alt'];

    protected function casts(): array
    {
        return ['size' => 'integer'];
    }
}
