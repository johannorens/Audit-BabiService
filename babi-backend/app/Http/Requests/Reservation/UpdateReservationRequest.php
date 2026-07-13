<?php

namespace App\Http\Requests\Reservation;

use App\Models\Reservation;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateReservationRequest extends FormRequest
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
            'date_reservation'  => 'sometimes|date',
            'heure_reservation' => 'sometimes|date_format:H:i',
            'statut'            => 'sometimes|in:en_attente,confirmee,annulee,terminee',
            'id_utilisateur'    => 'sometimes|exists:utilisateurs,id_utilisateur',
            'id_service'        => 'sometimes|exists:services,id_service',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (!$this->hasAny(['date_reservation', 'heure_reservation', 'id_service'])) {
                return;
            }

            $reservation = Reservation::find($this->route('reservation'));
            if (!$reservation) {
                return;
            }

            $creneauPris = Reservation::where('id_service', $this->input('id_service', $reservation->id_service))
                ->where('date_reservation', $this->input('date_reservation', $reservation->date_reservation))
                ->where('heure_reservation', $this->input('heure_reservation', $reservation->heure_reservation))
                ->where('id_reservation', '!=', $reservation->id_reservation)
                ->whereNotIn('statut', ['annulee'])
                ->exists();

            if ($creneauPris) {
                $validator->errors()->add('id_service', "Ce créneau n'est plus disponible pour ce service.");
            }
        });
    }
}
