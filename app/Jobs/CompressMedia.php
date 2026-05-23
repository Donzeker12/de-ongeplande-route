<?php

namespace App\Jobs;

use App\Models\Media;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;

class CompressMedia implements ShouldQueue
{
    use Queueable;

    public int $timeout = 600;

    public function __construct(public Media $media) {}

    public function handle(): void
    {
        $inputPath = Storage::disk('public')->path($this->media->path);

        if (! file_exists($inputPath)) {
            $this->media->update(['processing' => false]);

            return;
        }

        $ext = pathinfo($inputPath, PATHINFO_EXTENSION);
        $tmpPath = $inputPath.'_compressed.'.$ext;

        $cmd = sprintf(
            'ffmpeg -y -i %s -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart %s 2>&1',
            escapeshellarg($inputPath),
            escapeshellarg($tmpPath)
        );

        exec($cmd, $output, $exitCode);

        if ($exitCode === 0 && file_exists($tmpPath) && filesize($tmpPath) < filesize($inputPath)) {
            rename($tmpPath, $inputPath);
            clearstatcache(true, $inputPath);
            $this->media->update([
                'processing' => false,
                'size' => filesize($inputPath),
            ]);
        } else {
            if (file_exists($tmpPath)) {
                unlink($tmpPath);
            }
            $this->media->update(['processing' => false]);
        }
    }

    public function failed(\Throwable $e): void
    {
        $this->media->update(['processing' => false]);
    }
}
