<?php

namespace App\Http\Requests\Prestataire;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;


class StorePrestaireRequest extends FormRequest
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
            'nom'          => 'required|string|max:100',
            'prenom'       => 'required|string|max:100',
            'email'        => 'required|email|unique:prestataires',
            'telephone'    => 'nullable|string|max:20',
            'localisation' => 'nullable|string|max:255',
            'note_moyenne' => 'nullable|decimal:0,2',
            'id_categorie' => 'required|exists:categories,id_categorie',
        ];
    }
}
