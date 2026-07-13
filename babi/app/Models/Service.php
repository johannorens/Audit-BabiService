<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_service';

    protected $fillable = [
        'nom_service',
        'description',
        'photo_path',
        'tarif',
        'disponibilite',
        'id_prestataire',
        'id_categorie',
    ];

    public function prestataire()
    {
        return $this->belongsTo(Prestataire::class, 'id_prestataire');
    }

    public function categorie()
    {
        return $this->belongsTo(Categorie::class, 'id_categorie');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'id_service');
    }
}