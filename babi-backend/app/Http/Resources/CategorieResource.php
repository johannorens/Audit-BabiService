<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategorieResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_categorie' => $this->id_categorie,
            'nom_categorie' => $this->nom_categorie,
            'description' => $this->description,
        ];
    }
}
