<?php

namespace App\Http\Requests\Service;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nom_service'    => 'sometimes|string|max:100',
            'description'    => 'nullable|string',
            'photo'          => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'photo_path'     => 'nullable|string|max:255',
            'tarif'          => 'sometimes|numeric|min:0',
            'disponibilite'  => ['sometimes', 'boolean'],
            'id_prestataire' => 'sometimes|exists:prestataires,id_prestataire',
            'id_categorie'   => 'sometimes|exists:categories,id_categorie',
        ];
    }
}
