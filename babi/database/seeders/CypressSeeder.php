<?php

namespace Database\Seeders;

use App\Models\Categorie;
use App\Models\Prestataire;
use App\Models\Service;
use App\Models\Utilisateur;
use Illuminate\Database\Seeder;

class CypressSeeder extends Seeder
{
    public function run(): void
    {
        Utilisateur::where('email', 'admin_cypress@babi.com')->delete();

        $admin = Utilisateur::factory()->admin()->create([
            'email' => 'admin_cypress@babi.com',
            'prenom' => 'Admin',
            'nom' => 'Cypress',
        ]);

        $prestataire = Prestataire::factory()->create();
        $categorie = Categorie::factory()->create(['nom_categorie' => 'Cypress Test']);

        $service = Service::factory()->create([
            'nom_service' => 'Service Cypress',
            'id_prestataire' => $prestataire->id_prestataire,
            'id_categorie' => $categorie->id_categorie,
            'tarif' => 2500,
            'disponibilite' => true,
        ]);

        $this->command->info("SERVICE_ID={$service->id_service}");
    }
}
