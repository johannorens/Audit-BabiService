<?php

namespace Tests\Feature;

use App\Models\Avis;
use App\Models\Prestataire;
use App\Models\Reservation;
use App\Models\Service;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AvisTest extends TestCase
{
    use RefreshDatabase;

    public function test_impossible_de_noter_une_reservation_qui_nest_pas_terminee(): void
    {
        $client = Utilisateur::factory()->create();
        $reservation = Reservation::factory()->create([
            'id_utilisateur' => $client->id_utilisateur,
            'statut' => 'confirmee',
        ]);

        Sanctum::actingAs($client);

        $this->postJson('/api/avis', [
            'note' => 5,
            'commentaire' => 'Top',
            'date_avis' => '2026-07-01',
            'id_reservation' => $reservation->id_reservation,
        ])->assertStatus(422);

        $this->assertDatabaseMissing('avis', ['id_reservation' => $reservation->id_reservation]);
    }

    public function test_impossible_de_noter_la_reservation_dun_autre_utilisateur(): void
    {
        $proprietaire = Utilisateur::factory()->create();
        $autre = Utilisateur::factory()->create();
        $reservation = Reservation::factory()->terminee()->create([
            'id_utilisateur' => $proprietaire->id_utilisateur,
        ]);

        Sanctum::actingAs($autre);

        $this->postJson('/api/avis', [
            'note' => 5,
            'commentaire' => 'Top',
            'date_avis' => '2026-07-01',
            'id_reservation' => $reservation->id_reservation,
        ])->assertStatus(403);
    }

    public function test_noter_une_reservation_terminee_reussit_et_recalcule_la_note_moyenne(): void
    {
        $client = Utilisateur::factory()->create();
        $prestataire = Prestataire::factory()->create(['note_moyenne' => 0]);
        $service = Service::factory()->create(['id_prestataire' => $prestataire->id_prestataire]);
        $reservation = Reservation::factory()->terminee()->create([
            'id_utilisateur' => $client->id_utilisateur,
            'id_service' => $service->id_service,
        ]);

        Sanctum::actingAs($client);

        $this->postJson('/api/avis', [
            'note' => 4,
            'commentaire' => 'Très bien',
            'date_avis' => '2026-07-01',
            'id_reservation' => $reservation->id_reservation,
        ])->assertStatus(201);

        $this->assertEquals(4, $prestataire->fresh()->note_moyenne);
    }

    public function test_un_seul_avis_par_reservation(): void
    {
        $client = Utilisateur::factory()->create();
        $reservation = Reservation::factory()->terminee()->create([
            'id_utilisateur' => $client->id_utilisateur,
        ]);
        Avis::factory()->create([
            'id_utilisateur' => $client->id_utilisateur,
            'id_reservation' => $reservation->id_reservation,
        ]);

        Sanctum::actingAs($client);

        $this->postJson('/api/avis', [
            'note' => 3,
            'date_avis' => '2026-07-01',
            'id_reservation' => $reservation->id_reservation,
        ])->assertStatus(422)->assertJsonValidationErrors('id_reservation');
    }

    public function test_index_ne_retourne_que_les_avis_de_lutilisateur_connecte(): void
    {
        $client1 = Utilisateur::factory()->create();
        $client2 = Utilisateur::factory()->create();
        Avis::factory()->create(['id_utilisateur' => $client1->id_utilisateur]);
        Avis::factory()->create(['id_utilisateur' => $client2->id_utilisateur]);

        Sanctum::actingAs($client1);

        $response = $this->getJson('/api/avis');

        $response->assertOk();
        $this->assertCount(1, $response->json());
    }

    public function test_show_refuse_si_on_nest_pas_lauteur(): void
    {
        $auteur = Utilisateur::factory()->create();
        $autre = Utilisateur::factory()->create();
        $avis = Avis::factory()->create(['id_utilisateur' => $auteur->id_utilisateur]);

        Sanctum::actingAs($autre);

        $this->getJson("/api/avis/{$avis->id_avis}")->assertStatus(403);
    }

    public function test_lauteur_peut_modifier_son_avis(): void
    {
        $auteur = Utilisateur::factory()->create();
        $avis = Avis::factory()->create(['id_utilisateur' => $auteur->id_utilisateur, 'note' => 2]);

        Sanctum::actingAs($auteur);

        $this->putJson("/api/avis/{$avis->id_avis}", ['note' => 5])
            ->assertOk()
            ->assertJsonFragment(['note' => 5]);
    }

    public function test_lauteur_peut_supprimer_son_avis(): void
    {
        $auteur = Utilisateur::factory()->create();
        $avis = Avis::factory()->create(['id_utilisateur' => $auteur->id_utilisateur]);

        Sanctum::actingAs($auteur);

        $this->deleteJson("/api/avis/{$avis->id_avis}")->assertOk();
        $this->assertDatabaseMissing('avis', ['id_avis' => $avis->id_avis]);
    }

    public function test_impossible_de_signaler_son_propre_avis(): void
    {
        $auteur = Utilisateur::factory()->create();
        $avis = Avis::factory()->create(['id_utilisateur' => $auteur->id_utilisateur]);

        Sanctum::actingAs($auteur);

        $this->postJson("/api/avis/{$avis->id_avis}/signaler", [
            'motif' => 'Je change d\'avis',
        ])->assertStatus(422);

        $this->assertFalse($avis->fresh()->signale);
    }

    public function test_signaler_lavis_dun_autre_utilisateur_le_masque_et_lexclut_de_la_moyenne(): void
    {
        $auteur = Utilisateur::factory()->create();
        $signaleur = Utilisateur::factory()->create();
        $prestataire = Prestataire::factory()->create();
        $service = Service::factory()->create(['id_prestataire' => $prestataire->id_prestataire]);
        $reservation = Reservation::factory()->terminee()->create([
            'id_utilisateur' => $auteur->id_utilisateur,
            'id_service' => $service->id_service,
        ]);
        $avis = Avis::factory()->create([
            'id_utilisateur' => $auteur->id_utilisateur,
            'id_reservation' => $reservation->id_reservation,
            'note' => 1,
        ]);

        Sanctum::actingAs($signaleur);

        $this->postJson("/api/avis/{$avis->id_avis}/signaler", [
            'motif' => 'Avis injurieux',
        ])->assertOk();

        $avis->refresh();
        $this->assertTrue($avis->signale);
        $this->assertSame($signaleur->id_utilisateur, $avis->signale_par);
        $this->assertEquals(0, $prestataire->fresh()->note_moyenne);
    }

    public function test_parservice_ne_retourne_pas_les_avis_signales(): void
    {
        $prestataire = Prestataire::factory()->create();
        $service = Service::factory()->create(['id_prestataire' => $prestataire->id_prestataire]);

        $reservationVisible = Reservation::factory()->terminee()->create(['id_service' => $service->id_service]);
        $reservationSignalee = Reservation::factory()->terminee()->create(['id_service' => $service->id_service]);

        Avis::factory()->create(['id_reservation' => $reservationVisible->id_reservation]);
        Avis::factory()->create(['id_reservation' => $reservationSignalee->id_reservation, 'signale' => true]);

        $response = $this->getJson("/api/services/{$service->id_service}/avis");

        $response->assertOk();
        $this->assertCount(1, $response->json());
        $this->assertSame(
            $reservationVisible->id_reservation,
            $response->json('0.id_reservation')
        );
    }

    public function test_parservice_est_accessible_sans_authentification(): void
    {
        $service = Service::factory()->create();

        $this->getJson("/api/services/{$service->id_service}/avis")->assertOk();
    }
}
