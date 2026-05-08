<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDiscoveryRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'outing_id' => ['nullable', 'exists:outings,id'],
            'venue_id' => ['nullable', 'exists:venues,id'],
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:dier,plek,weetje'],
            'description' => ['required', 'string'],
            'image' => ['nullable', 'url'],
            'metadata' => ['nullable', 'array'],
            // Dier
            'metadata.wetenschappelijke_naam' => ['nullable', 'string', 'max:255'],
            'metadata.sociaal_gedrag' => ['nullable', 'string', 'max:100'],
            'metadata.voedsel' => ['nullable', 'string', 'max:255'],
            'metadata.gewicht' => ['nullable', 'string', 'max:100'],
            'metadata.lengte' => ['nullable', 'string', 'max:100'],
            'metadata.nesttijd' => ['nullable', 'string', 'max:100'],
            'metadata.zorgtijd' => ['nullable', 'string', 'max:100'],
            'metadata.geslachtsrijp' => ['nullable', 'string', 'max:100'],
            'metadata.leeftijd_wild' => ['nullable', 'string', 'max:100'],
            'metadata.leefgebied' => ['nullable', 'string', 'max:255'],
            'metadata.bedreigingsstatus' => ['nullable', 'string', 'in:niet_bedreigd,bijna_bedreigd,kwetsbaar,bedreigd,ernstig_bedreigd,uitgestorven_wild'],
            'metadata.weetje_tekst' => ['nullable', 'string'],
            // Plek
            'metadata.extra_fotos' => ['nullable', 'array'],
            'metadata.extra_fotos.*' => ['nullable', 'url'],
            // Weetje
            'metadata.bron' => ['nullable', 'string', 'max:255'],
        ];
    }
}
