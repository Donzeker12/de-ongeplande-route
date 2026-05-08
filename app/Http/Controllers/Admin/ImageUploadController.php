<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ImageUploadController extends Controller
{
    /**
     * Handle image upload and return the public URL.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'max:5120'], // max 5MB
        ], [
            'image.required' => 'Kies een afbeelding om te uploaden.',
            'image.image' => 'Het bestand moet een afbeelding zijn (jpg, png, gif, webp).',
            'image.max' => 'De afbeelding mag maximaal 5 MB zijn.',
        ]);

        $path = $request->file('image')->store('uploads', 'public');

        return response()->json([
            'url' => asset('storage/'.$path),
        ]);
    }
}
