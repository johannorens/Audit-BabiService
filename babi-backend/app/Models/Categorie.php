<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_categorie';

    protected $fillable = [
        'nom_categorie',
        'description',
    ];

    public function prestataires()
    {
        return $this->hasMany(Prestataire::class, 'id_categorie');
    }

    public function services()
    {
        return $this->hasMany(Service::class, 'id_categorie');
    }
}
