<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AvisResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_avis' => $this->id_avis,
            'note' => $this->note,
            'commentaire' => $this->commentaire,
            'date_avis' => $this->date_avis,
            'signale' => $this->signale,
           
            'motif_signalement' => $this->when(
                $request->user()?->role === 'admin',
                $this->motif_signalement
            ),
            'utilisateur' => new UtilisateurResource($this->whenLoaded('utilisateur')),
        ];
    }
}
