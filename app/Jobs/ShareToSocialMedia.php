<?php

namespace App\Jobs;

use App\Models\Outing;
use App\Services\SocialShareService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ShareToSocialMedia implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 60;

    /**
     * Create a new job instance.
     *
     * @param  array<string, bool>  $platforms  e.g. ['facebook' => true, 'instagram' => false]
     */
    public function __construct(
        public Outing $outing,
        public array $platforms,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(SocialShareService $service): void
    {
        if ($this->platforms['facebook'] ?? false) {
            $service->shareToFacebook($this->outing);
        }

        if ($this->platforms['instagram'] ?? false) {
            $service->shareToInstagram($this->outing);
        }
    }
}
