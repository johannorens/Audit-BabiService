<?php

namespace Database\Seeders;

use App\Models\Utilisateur;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Utilisateur::updateOrCreate(
            ['email' => 'admin@babiservices.ci'],
            [
                'nom'          => 'Admin',
                'prenom'       => 'Babi',
                'mot_de_passe' => Hash::make('password'),
                'telephone'    => null,
                'adresse'      => null,
                'role'         => 'admin',
            ]
        );
    }
}
