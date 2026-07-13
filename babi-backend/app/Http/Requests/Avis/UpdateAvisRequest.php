<?php

namespace App\Http\Requests\Avis;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAvisRequest extends FormRequest
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
            'note'        => 'sometimes|integer|min:1|max:5',
            'commentaire' => 'nullable|string',
            'date_avis'   => 'sometimes|date',
        ];
    }
}
