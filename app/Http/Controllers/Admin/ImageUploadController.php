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
        ]);

        $path = $request->file('image')->store('uploads', 'public');

        return response()->json([
            'url' => asset('storage/'.$path),
        ]);
    }
}
