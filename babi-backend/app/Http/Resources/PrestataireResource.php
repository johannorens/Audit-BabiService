<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrestataireResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_prestataire' => $this->id_prestataire,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'email' => $this->email,
            'telephone' => $this->telephone,
            'specialite' => $this->specialite,
            'localisation' => $this->localisation,
            'note_moyenne' => $this->note_moyenne,
            'statut' => $this->statut,
            'categorie' => new CategorieResource($this->whenLoaded('categorie')),
        ];
    }
}
