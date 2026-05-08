<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Media/Index', [
            'media' => Media::query()->latest()->get(),
        ]);
    }

    public function list(): JsonResponse
    {
        return response()->json(Media::query()->latest()->get());
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'max:10240'],
        ]);

        $file = $request->file('image');
        $path = $file->store('uploads', 'public');

        $media = Media::create([
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'url' => asset('storage/'.$path),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        return response()->json($media, 201);
    }

    public function destroy(Media $medium): JsonResponse
    {
        Storage::disk('public')->delete($medium->path);
        $medium->delete();

        return response()->json(['deleted' => true]);
    }
}
