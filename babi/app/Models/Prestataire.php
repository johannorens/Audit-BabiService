<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prestataire extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_prestataire';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'specialite',
        'localisation',
        'note_moyenne',
        'statut',
        'id_categorie',
    ];

    public function services()
    {
        return $this->hasMany(Service::class, 'id_prestataire');
    }

    public function categorie()
    {
        return $this->belongsTo(Categorie::class, 'id_categorie');
    }
}