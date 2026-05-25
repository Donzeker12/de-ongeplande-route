<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\CompressMedia;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class MediaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Media/Index', [
            'media' => Media::query()->where('mime_type', 'LIKE', 'image/%')->latest()->get(),
        ]);
    }

    public function videos(): Response
    {
        return Inertia::render('Admin/Media/Videos', [
            'media' => Media::query()->where('mime_type', 'LIKE', 'video/%')->latest()->get(),
        ]);
    }

    public function list(): JsonResponse
    {
        return response()->json(Media::query()->latest()->get());
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'file', 'mimes:jpg,jpeg,png,gif,webp,mp4,mov,webm,ogg', 'max:204800'],
        ], [
            'image.required' => 'Kies een bestand om te uploaden.',
            'image.mimes' => 'Alleen afbeeldingen (jpg, png, gif, webp) en video\'s (mp4, mov, webm) zijn toegestaan.',
            'image.max' => 'Het bestand mag maximaal 200 MB zijn.',
        ]);

        $file = $request->file('image');
        $isVideo = str_starts_with($file->getMimeType() ?? '', 'video/');
        $directory = $isVideo ? 'uploads/videos' : 'uploads';
        $path = $file->store($directory, 'public');

        if (! $isVideo) {
            $this->optimizeImage(Storage::disk('public')->path($path));
        }

        $media = Media::create([
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'url' => asset('storage/'.$path),
            'mime_type' => $file->getMimeType(),
            'size' => Storage::disk('public')->size($path),
            'processing' => $isVideo,
        ]);

        if ($isVideo) {
            CompressMedia::dispatch($media);
        }

        return response()->json($media, 201);
    }

    public function storeVideo(Request $request): JsonResponse
    {
        $request->validate([
            'video' => ['required', 'file', 'mimes:mp4,mov,webm,ogg', 'max:204800'],
        ], [
            'video.required' => 'Kies een video om te uploaden.',
            'video.mimes' => 'Alleen mp4, mov, webm en ogg bestanden zijn toegestaan.',
            'video.max' => 'De video mag maximaal 200 MB zijn.',
        ]);

        $file = $request->file('video');
        $path = $file->store('uploads/videos', 'public');

        $media = Media::create([
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'url' => asset('storage/'.$path),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'processing' => true,
        ]);

        CompressMedia::dispatch($media);

        return response()->json([
            'url' => $media->url,
            'id' => $media->id,
        ], 201);
    }

    public function optimize(Media $medium): JsonResponse
    {
        $fullPath = Storage::disk('public')->path($medium->path);

        if (! file_exists($fullPath)) {
            return response()->json(['error' => 'Bestand niet gevonden.'], 404);
        }

        $this->optimizeImage($fullPath);

        $medium->update(['size' => Storage::disk('public')->size($medium->path)]);

        return response()->json(['size' => $medium->size]);
    }

    public function compress(Media $medium): JsonResponse
    {
        if ($medium->processing) {
            return response()->json(['error' => 'Al bezig met comprimeren.'], 409);
        }

        $medium->update(['processing' => true]);
        CompressMedia::dispatch($medium);

        return response()->json(['processing' => true]);
    }

    public function update(Request $request, Media $medium): JsonResponse
    {
        $validated = $request->validate([
            'alt' => ['nullable', 'string', 'max:255'],
            'folder' => ['nullable', 'string', 'max:100'],
        ]);

        $medium->update($validated);

        return response()->json(['updated' => true]);
    }

    public function destroy(Media $medium): JsonResponse
    {
        Storage::disk('public')->delete($medium->path);
        $medium->delete();

        return response()->json(['deleted' => true]);
    }

    private function optimizeImage(string $fullPath): void
    {
        $manager = new ImageManager(new Driver);
        $image = $manager->read($fullPath);

        if ($image->width() > 2048) {
            $image->scaleDown(width: 2048);
        }

        $mime = mime_content_type($fullPath);

        match (true) {
            in_array($mime, ['image/jpeg', 'image/jpg']) => $image->toJpeg(85)->save($fullPath),
            $mime === 'image/webp' => $image->toWebp(85)->save($fullPath),
            $mime === 'image/png' => $image->toPng()->save($fullPath),
            default => $image->save($fullPath),
        };
    }
}
