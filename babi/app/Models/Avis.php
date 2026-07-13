<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Avis extends Model
{
    use HasFactory;

    protected $table = 'avis';

    protected $primaryKey = 'id_avis';

    protected $fillable = [
        'note',
        'commentaire',
        'date_avis',
        'id_utilisateur',
        'id_reservation',
        'signale',
        'motif_signalement',
        'signale_par',
    ];

    protected function casts(): array
    {
        return [
            'signale' => 'boolean',
        ];
    }

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur');
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'id_reservation');
    }

    public function signalePar()
    {
        return $this->belongsTo(Utilisateur::class, 'signale_par');
    }

    protected static function booted(): void
    {
        static::saved(fn (Avis $avis) => $avis->recalculerNoteMoyennePrestataire());
        static::deleted(fn (Avis $avis) => $avis->recalculerNoteMoyennePrestataire());
    }

    public function recalculerNoteMoyennePrestataire(): void
    {
        $idPrestataire = $this->reservation?->service?->id_prestataire;
        if (! $idPrestataire) {
            return;
        }

        $moyenne = self::query()
            ->where('signale', false)
            ->whereHas('reservation.service', fn ($q) => $q->where('id_prestataire', $idPrestataire))
            ->avg('note');

        Prestataire::where('id_prestataire', $idPrestataire)->update([
            'note_moyenne' => round($moyenne ?? 0, 2),
        ]);
    }
}
