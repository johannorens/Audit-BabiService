<?php

namespace App\Http\Requests\Prestataire;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePrestaireRequest extends FormRequest
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
            'nom'          => 'sometimes|string|max:100',
            'prenom'       => 'sometimes|string|max:100',
            'email'        => 'sometimes|email|unique:prestataires,email,' . $this->route('prestataire') . ',id_prestataire',
            'telephone'    => 'nullable|string|max:20',
            'localisation' => 'nullable|string|max:255',
            'note_moyenne' => 'nullable|decimal:0,2',
            'id_categorie' => 'sometimes|exists:categories,id_categorie',
        ];
    }
}
