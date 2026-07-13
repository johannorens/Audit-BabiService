<?php

namespace Tests\Feature;

use App\Models\Reservation;
use App\Models\Service;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    public function test_creation_necessite_authentification(): void
    {
        $service = Service::factory()->create();

        $this->postJson('/api/reservations', [
            'date_reservation' => '2026-07-10',
            'heure_reservation' => '10:00',
            'id_service' => $service->id_service,
        ])->assertUnauthorized();
    }

    public function test_creation_reussit_et_force_le_statut_confirmee(): void
    {
        $utilisateur = Utilisateur::factory()->create();
        $service = Service::factory()->create();
        Sanctum::actingAs($utilisateur);

        $response = $this->postJson('/api/reservations', [
            'date_reservation' => '2026-07-10',
            'heure_reservation' => '10:00',
            'id_service' => $service->id_service,
            'statut' => 'terminee', // doit être ignoré
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'statut' => 'confirmee',
                'id_utilisateur' => $utilisateur->id_utilisateur,
            ]);
    }

    public function test_index_ne_retourne_que_les_reservations_du_client_connecte(): void
    {
        $client1 = Utilisateur::factory()->create();
        $client2 = Utilisateur::factory()->create();
        Reservation::factory()->create(['id_utilisateur' => $client1->id_utilisateur]);
        Reservation::factory()->create(['id_utilisateur' => $client2->id_utilisateur]);

        Sanctum::actingAs($client1);

        $response = $this->getJson('/api/reservations');

        $response->assertOk();
        $this->assertCount(1, $response->json());
        $this->assertSame($client1->id_utilisateur, $response->json('0.id_utilisateur'));
    }

    public function test_admin_voit_toutes_les_reservations(): void
    {
        $admin = Utilisateur::factory()->admin()->create();
        Reservation::factory()->count(3)->create();

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/reservations');

        $response->assertOk();
        $this->assertCount(3, $response->json());
    }

    public function test_show_refuse_si_on_nest_pas_le_proprietaire(): void
    {
        $proprietaire = Utilisateur::factory()->create();
        $autre = Utilisateur::factory()->create();
        $reservation = Reservation::factory()->create(['id_utilisateur' => $proprietaire->id_utilisateur]);

        Sanctum::actingAs($autre);

        $this->getJson("/api/reservations/{$reservation->id_reservation}")
            ->assertStatus(403);
    }

    public function test_le_proprietaire_peut_annuler_sa_reservation(): void
    {
        $client = Utilisateur::factory()->create();
        $reservation = Reservation::factory()->create([
            'id_utilisateur' => $client->id_utilisateur,
            'statut' => 'confirmee',
        ]);

        Sanctum::actingAs($client);

        $this->putJson("/api/reservations/{$reservation->id_reservation}", [
            'statut' => 'annulee',
        ])->assertOk()->assertJsonFragment(['statut' => 'annulee']);
    }

    public function test_update_refuse_si_on_nest_pas_le_proprietaire_ni_admin(): void
    {
        $proprietaire = Utilisateur::factory()->create();
        $autre = Utilisateur::factory()->create();
        $reservation = Reservation::factory()->create(['id_utilisateur' => $proprietaire->id_utilisateur]);

        Sanctum::actingAs($autre);

        $this->putJson("/api/reservations/{$reservation->id_reservation}", [
            'statut' => 'terminee',
        ])->assertStatus(403);
    }

    public function test_admin_peut_modifier_la_reservation_dun_autre_utilisateur(): void
    {
        $admin = Utilisateur::factory()->admin()->create();
        $client = Utilisateur::factory()->create();
        $reservation = Reservation::factory()->create([
            'id_utilisateur' => $client->id_utilisateur,
            'statut' => 'confirmee',
        ]);

        Sanctum::actingAs($admin);

        $this->putJson("/api/reservations/{$reservation->id_reservation}", [
            'statut' => 'terminee',
        ])->assertOk()->assertJsonFragment(['statut' => 'terminee']);
    }

    public function test_creation_echoue_si_le_creneau_est_deja_reserve(): void
    {
        $service = Service::factory()->create();
        Reservation::factory()->create([
            'id_service'        => $service->id_service,
            'date_reservation'  => '2026-07-10',
            'heure_reservation' => '10:00',
            'statut'            => 'confirmee',
        ]);

        Sanctum::actingAs(Utilisateur::factory()->create());

        $this->postJson('/api/reservations', [
            'date_reservation'  => '2026-07-10',
            'heure_reservation' => '10:00',
            'id_service'        => $service->id_service,
        ])->assertStatus(422)->assertJsonValidationErrors('id_service');
    }

    public function test_creation_echoue_si_le_service_nest_pas_disponible(): void
    {
        $service = Service::factory()->create(['disponibilite' => false]);
        Sanctum::actingAs(Utilisateur::factory()->create());

        $this->postJson('/api/reservations', [
            'date_reservation'  => '2026-07-10',
            'heure_reservation' => '10:00',
            'id_service'        => $service->id_service,
        ])->assertStatus(422)->assertJsonValidationErrors('id_service');
    }

    public function test_creation_reussit_si_le_creneau_precedent_est_annule(): void
    {
        $service = Service::factory()->create();
        Reservation::factory()->create([
            'id_service'        => $service->id_service,
            'date_reservation'  => '2026-07-10',
            'heure_reservation' => '10:00',
            'statut'            => 'annulee',
        ]);

        Sanctum::actingAs(Utilisateur::factory()->create());

        $this->postJson('/api/reservations', [
            'date_reservation'  => '2026-07-10',
            'heure_reservation' => '10:00',
            'id_service'        => $service->id_service,
        ])->assertStatus(201);
    }

    public function test_update_ne_permet_pas_de_reassigner_la_reservation_a_un_autre_utilisateur(): void
    {
        $proprietaire = Utilisateur::factory()->create();
        $autre = Utilisateur::factory()->create();
        $reservation = Reservation::factory()->create(['id_utilisateur' => $proprietaire->id_utilisateur]);

        Sanctum::actingAs($proprietaire);

        $this->putJson("/api/reservations/{$reservation->id_reservation}", [
            'id_utilisateur' => $autre->id_utilisateur,
        ])->assertOk();

        $this->assertSame($proprietaire->id_utilisateur, $reservation->fresh()->id_utilisateur);
    }

    public function test_destroy_refuse_si_on_nest_pas_le_proprietaire(): void
    {
        $proprietaire = Utilisateur::factory()->create();
        $autre = Utilisateur::factory()->create();
        $reservation = Reservation::factory()->create(['id_utilisateur' => $proprietaire->id_utilisateur]);

        Sanctum::actingAs($autre);

        $this->deleteJson("/api/reservations/{$reservation->id_reservation}")
            ->assertStatus(403);

        $this->assertDatabaseHas('reservations', ['id_reservation' => $reservation->id_reservation]);
    }
}
