<?php

namespace Tests\Feature;

use App\Models\Categorie;
use App\Models\Prestataire;
use App\Models\Service;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CategorieServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_categories_index_et_show_sont_publics(): void
    {
        $categorie = Categorie::factory()->create();

        $this->getJson('/api/categories')->assertOk();
        $this->getJson("/api/categories/{$categorie->id_categorie}")->assertOk();
    }

    public function test_creer_une_categorie_necessite_un_admin(): void
    {
        $client = Utilisateur::factory()->create();
        Sanctum::actingAs($client);

        $this->postJson('/api/categories', ['nom_categorie' => 'Plomberie'])
            ->assertStatus(403);
    }

    public function test_un_admin_peut_creer_une_categorie(): void
    {
        $admin = Utilisateur::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $this->postJson('/api/categories', ['nom_categorie' => 'Plomberie'])
            ->assertStatus(201);

        $this->assertDatabaseHas('categories', ['nom_categorie' => 'Plomberie']);
    }

    public function test_le_nom_de_categorie_doit_etre_unique(): void
    {
        Categorie::factory()->create(['nom_categorie' => 'Plomberie']);
        $admin = Utilisateur::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $this->postJson('/api/categories', ['nom_categorie' => 'Plomberie'])
            ->assertStatus(422);
    }

    public function test_services_index_et_show_sont_publics(): void
    {
        $service = Service::factory()->create();

        $this->getJson('/api/services')->assertOk();
        $this->getJson("/api/services/{$service->id_service}")->assertOk();
    }

    public function test_creer_un_service_necessite_un_admin(): void
    {
        $client = Utilisateur::factory()->create();
        $prestataire = Prestataire::factory()->create();
        $categorie = Categorie::factory()->create();
        Sanctum::actingAs($client);

        $this->postJson('/api/services', [
            'nom_service' => 'Réparation fuite',
            'tarif' => 5000,
            'disponibilite' => true,
            'id_prestataire' => $prestataire->id_prestataire,
            'id_categorie' => $categorie->id_categorie,
        ])->assertStatus(403);
    }

    public function test_un_admin_peut_creer_un_service(): void
    {
        Mail::fake();

        $admin = Utilisateur::factory()->admin()->create();
        $prestataire = Prestataire::factory()->create();
        $categorie = Categorie::factory()->create();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/services', [
            'nom_service' => 'Réparation fuite',
            'tarif' => 5000,
            'disponibilite' => true,
            'id_prestataire' => $prestataire->id_prestataire,
            'id_categorie' => $categorie->id_categorie,
        ]);

        $response->assertStatus(201)->assertJsonFragment(['nom_service' => 'Réparation fuite']);
    }

    public function test_un_admin_peut_supprimer_un_service(): void
    {
        $admin = Utilisateur::factory()->admin()->create();
        $service = Service::factory()->create();
        Sanctum::actingAs($admin);

        $this->deleteJson("/api/services/{$service->id_service}")->assertOk();
        $this->assertDatabaseMissing('services', ['id_service' => $service->id_service]);
    }
}
