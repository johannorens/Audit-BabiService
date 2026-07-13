<?php

namespace Tests\Feature;

use App\Models\Prestataire;
use App\Models\Reservation;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_refuse_sans_authentification(): void
    {
        $this->getJson('/api/admin/dashboard')->assertUnauthorized();
    }

    public function test_dashboard_refuse_a_un_client(): void
    {
        $client = Utilisateur::factory()->create();
        Sanctum::actingAs($client);

        $this->getJson('/api/admin/dashboard')->assertStatus(403);
    }

    public function test_dashboard_accessible_a_un_admin(): void
    {
        $admin = Utilisateur::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $this->getJson('/api/admin/dashboard')
            ->assertOk()
            ->assertJsonStructure(['stats', 'reservations_par_mois', 'activite_recente', 'a_valider']);
    }

    public function test_valider_un_prestataire(): void
    {
        $admin = Utilisateur::factory()->admin()->create();
        $prestataire = Prestataire::factory()->enAttente()->create();
        Sanctum::actingAs($admin);

        $this->patchJson("/api/admin/prestataires/{$prestataire->id_prestataire}/valider")
            ->assertOk();

        $this->assertSame('valide', $prestataire->fresh()->statut);
    }

    public function test_rejeter_un_prestataire(): void
    {
        $admin = Utilisateur::factory()->admin()->create();
        $prestataire = Prestataire::factory()->enAttente()->create();
        Sanctum::actingAs($admin);

        $this->patchJson("/api/admin/prestataires/{$prestataire->id_prestataire}/rejeter")
            ->assertOk();

        $this->assertSame('rejete', $prestataire->fresh()->statut);
    }

    public function test_un_admin_ne_peut_pas_supprimer_son_propre_compte(): void
    {
        $admin = Utilisateur::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $this->deleteJson("/api/admin/utilisateurs/{$admin->id_utilisateur}")
            ->assertStatus(403);

        $this->assertDatabaseHas('utilisateurs', ['id_utilisateur' => $admin->id_utilisateur]);
    }

    public function test_impossible_de_supprimer_un_utilisateur_ayant_des_reservations(): void
    {
        $admin = Utilisateur::factory()->admin()->create();
        $client = Utilisateur::factory()->create();
        Reservation::factory()->create(['id_utilisateur' => $client->id_utilisateur]);
        Sanctum::actingAs($admin);

        $this->deleteJson("/api/admin/utilisateurs/{$client->id_utilisateur}")
            ->assertStatus(422);

        $this->assertDatabaseHas('utilisateurs', ['id_utilisateur' => $client->id_utilisateur]);
    }

    public function test_supprimer_un_utilisateur_sans_reservation(): void
    {
        $admin = Utilisateur::factory()->admin()->create();
        $client = Utilisateur::factory()->create();
        Sanctum::actingAs($admin);

        $this->deleteJson("/api/admin/utilisateurs/{$client->id_utilisateur}")
            ->assertOk();

        $this->assertDatabaseMissing('utilisateurs', ['id_utilisateur' => $client->id_utilisateur]);
    }

    public function test_missions_necessite_un_admin(): void
    {
        $client = Utilisateur::factory()->create();
        Sanctum::actingAs($client);

        $this->getJson('/api/admin/missions')->assertStatus(403);
    }
}
