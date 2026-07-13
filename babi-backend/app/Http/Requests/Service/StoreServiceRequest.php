<?php

namespace App\Http\Requests\Service;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
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
            'nom_service'    => 'required|string|max:100',
            'description'    => 'nullable|string',
            'photo'          => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'photo_path'     => 'nullable|string|max:255',
            'tarif'          => 'required|numeric|min:0',
            'disponibilite'  => ['required', 'boolean'],
            'id_prestataire' => 'required|exists:prestataires,id_prestataire',
            'id_categorie'   => 'required|exists:categories,id_categorie',
        ];
    }
}
