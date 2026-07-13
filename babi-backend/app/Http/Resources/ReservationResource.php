<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_reservation' => $this->id_reservation,
            'date_reservation' => $this->date_reservation,
            'heure_reservation' => $this->heure_reservation,
            'statut' => $this->statut,
            'utilisateur' => new UtilisateurResource($this->whenLoaded('utilisateur')),
            'service' => new ServiceResource($this->whenLoaded('service')),
            'avis' => new AvisResource($this->whenLoaded('avis')),
        ];
    }
}
