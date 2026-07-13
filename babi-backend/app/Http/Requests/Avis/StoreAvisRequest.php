<?php

namespace App\Http\Requests\Avis;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAvisRequest extends FormRequest
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
            'note'           => 'required|integer|min:1|max:5',
            'commentaire'    => 'nullable|string',
            'date_avis'      => 'required|date',
            'id_reservation' => 'required|exists:reservations,id_reservation|unique:avis,id_reservation',
        ];
    }
}
