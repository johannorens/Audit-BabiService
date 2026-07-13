<?php

namespace Tests\Feature;

use App\Models\Categorie;
use App\Models\Prestataire;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PrestataireTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_et_show_sont_publics(): void
    {
        $prestataire = Prestataire::factory()->create();

        $this->getJson('/api/prestataires')->assertOk();
        $this->getJson("/api/prestataires/{$prestataire->id_prestataire}")->assertOk();
    }

    public function test_candidature_est_publique_et_cree_un_prestataire_en_attente(): void
    {
        $categorie = Categorie::factory()->create();

        $response = $this->postJson('/api/prestataires/candidature', [
            'nom' => 'Koné',
            'prenom' => 'Awa',
            'email' => 'awa.prestataire@example.com',
            'telephone' => '0700000000',
            'localisation' => 'Cocody',
            'id_categorie' => $categorie->id_categorie,
        ]);

        $response->assertStatus(201)->assertJsonFragment(['statut' => 'en_attente']);
        $this->assertDatabaseHas('prestataires', [
            'email' => 'awa.prestataire@example.com',
            'statut' => 'en_attente',
        ]);
    }

    public function test_creation_directe_necessite_un_admin(): void
    {
        $categorie = Categorie::factory()->create();
        $client = Utilisateur::factory()->create();
        Sanctum::actingAs($client);

        $this->postJson('/api/prestataires', [
            'nom' => 'Koné',
            'prenom' => 'Awa',
            'email' => 'awa2@example.com',
            'id_categorie' => $categorie->id_categorie,
        ])->assertStatus(403);
    }

    public function test_creation_directe_sans_authentification_est_refusee(): void
    {
        $categorie = Categorie::factory()->create();

        $this->postJson('/api/prestataires', [
            'nom' => 'Koné',
            'prenom' => 'Awa',
            'email' => 'awa3@example.com',
            'id_categorie' => $categorie->id_categorie,
        ])->assertUnauthorized();
    }

    public function test_un_admin_peut_creer_un_prestataire_directement_valide(): void
    {
        $admin = Utilisateur::factory()->admin()->create();
        $categorie = Categorie::factory()->create();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/prestataires', [
            'nom' => 'Koné',
            'prenom' => 'Awa',
            'email' => 'awa4@example.com',
            'id_categorie' => $categorie->id_categorie,
        ]);

        $response->assertStatus(201)->assertJsonFragment(['statut' => 'valide']);
    }

    public function test_un_admin_peut_supprimer_un_prestataire(): void
    {
        $admin = Utilisateur::factory()->admin()->create();
        $prestataire = Prestataire::factory()->create();
        Sanctum::actingAs($admin);

        $this->deleteJson("/api/prestataires/{$prestataire->id_prestataire}")->assertOk();
        $this->assertDatabaseMissing('prestataires', ['id_prestataire' => $prestataire->id_prestataire]);
    }

    public function test_un_client_ne_peut_pas_supprimer_un_prestataire(): void
    {
        $client = Utilisateur::factory()->create();
        $prestataire = Prestataire::factory()->create();
        Sanctum::actingAs($client);

        $this->deleteJson("/api/prestataires/{$prestataire->id_prestataire}")->assertStatus(403);
        $this->assertDatabaseHas('prestataires', ['id_prestataire' => $prestataire->id_prestataire]);
    }
}
