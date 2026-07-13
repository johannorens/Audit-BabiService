<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_service' => $this->id_service,
            'nom_service' => $this->nom_service,
            'description' => $this->description,
            'photo_url' => $this->photo_path,
            'tarif' => $this->tarif,
            'disponibilite' => $this->disponibilite,
            'prestataire' => new PrestataireResource($this->whenLoaded('prestataire')),
            'categorie' => new CategorieResource($this->whenLoaded('categorie')),
        ];
    }
}
