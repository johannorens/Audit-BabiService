<?php

namespace App\Http\Requests\Reservation;

use App\Models\Reservation;
use App\Models\Service;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
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
            'date_reservation'  => 'required|date',
            'heure_reservation' => 'required|date_format:H:i',
            'id_service'        => [
                'required',
                'exists:services,id_service',
                function ($attribute, $value, $fail) {
                    if (Service::whereKey($value)->where('disponibilite', false)->exists()) {
                        $fail("Ce service n'est pas disponible actuellement.");
                        return;
                    }

                    $creneauPris = Reservation::where('id_service', $value)
                        ->where('date_reservation', $this->input('date_reservation'))
                        ->where('heure_reservation', $this->input('heure_reservation'))
                        ->whereNotIn('statut', ['annulee'])
                        ->exists();

                    if ($creneauPris) {
                        $fail("Ce créneau n'est plus disponible pour ce service.");
                    }
                },
            ],
        ];
    }
}
