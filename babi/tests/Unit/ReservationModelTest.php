<?php

namespace Tests\Unit;

use App\Models\Avis;
use App\Models\Reservation;
use App\Models\Service;
use App\Models\Utilisateur;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_relation_utilisateur_est_belongs_to(): void
    {
        $reservation = Reservation::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $reservation->utilisateur());
    }

    public function test_relation_service_est_belongs_to(): void
    {
        $reservation = Reservation::factory()->create();

        $this->assertInstanceOf(BelongsTo::class, $reservation->service());
    }

    public function test_relation_avis_est_has_one(): void
    {
        $reservation = Reservation::factory()->create();

        $this->assertInstanceOf(HasOne::class, $reservation->avis());
    }

    public function test_statut_par_defaut_est_confirmee(): void
    {
        $reservation = Reservation::factory()->create();

        $this->assertSame('confirmee', $reservation->statut);
    }

    public function test_statut_peut_etre_mis_a_annulee(): void
    {
        $reservation = Reservation::factory()->create(['statut' => 'confirmee']);

        $reservation->update(['statut' => 'annulee']);

        $this->assertSame('annulee', $reservation->fresh()->statut);
    }

    public function test_statut_peut_etre_mis_a_terminee(): void
    {
        $reservation = Reservation::factory()->terminee()->create();

        $this->assertSame('terminee', $reservation->statut);
    }

    public function test_reservation_appartient_au_bon_utilisateur(): void
    {
        $client = Utilisateur::factory()->create();
        $reservation = Reservation::factory()->create(['id_utilisateur' => $client->id_utilisateur]);

        $this->assertSame($client->id_utilisateur, $reservation->utilisateur->id_utilisateur);
    }

    public function test_reservation_appartient_au_bon_service(): void
    {
        $service = Service::factory()->create();
        $reservation = Reservation::factory()->create(['id_service' => $service->id_service]);

        $this->assertSame($service->id_service, $reservation->service->id_service);
    }

    public function test_suppression_de_la_reservation(): void
    {
        $reservation = Reservation::factory()->create();
        $id = $reservation->id_reservation;

        $reservation->delete();

        $this->assertDatabaseMissing('reservations', ['id_reservation' => $id]);
    }

    public function test_avis_lie_a_la_reservation(): void
    {
        $reservation = Reservation::factory()->terminee()->create();
        $avis = Avis::factory()->create(['id_reservation' => $reservation->id_reservation]);

        $this->assertSame($avis->id_avis, $reservation->avis->id_avis);
    }
}
