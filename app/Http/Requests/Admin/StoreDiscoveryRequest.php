<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreDiscoveryRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'outing_id' => ['required', 'exists:outings,id'],
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:dier,plek,weetje'],
            'description' => ['required', 'string'],
            'image' => ['nullable', 'url'],
        ];
    }
}
