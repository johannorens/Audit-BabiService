<?php

namespace Tests\Unit;

use App\Models\Avis;
use App\Models\Prestataire;
use App\Models\Reservation;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AvisNoteMoyenneTest extends TestCase
{
    use RefreshDatabase;

    private function reservationPour(Prestataire $prestataire): Reservation
    {
        $service = Service::factory()->create(['id_prestataire' => $prestataire->id_prestataire]);

        return Reservation::factory()->terminee()->create(['id_service' => $service->id_service]);
    }

    public function test_la_note_moyenne_est_zero_sans_avis(): void
    {
        $prestataire = Prestataire::factory()->create(['note_moyenne' => 5]);

        // Forcer un recalcul sans aucun avis existant
        $reservation = $this->reservationPour($prestataire);
        $avis = Avis::factory()->create(['id_reservation' => $reservation->id_reservation, 'note' => 3]);
        $avis->delete();

        $this->assertEquals(0, $prestataire->fresh()->note_moyenne);
    }

    public function test_la_note_moyenne_est_la_moyenne_de_tous_les_avis_du_prestataire(): void
    {
        $prestataire = Prestataire::factory()->create();

        foreach ([3, 5, 4] as $note) {
            $reservation = $this->reservationPour($prestataire);
            Avis::factory()->create(['id_reservation' => $reservation->id_reservation, 'note' => $note]);
        }

        $this->assertEquals(4, $prestataire->fresh()->note_moyenne);
    }

    public function test_les_avis_dun_autre_prestataire_ne_sont_pas_comptes(): void
    {
        $prestataireA = Prestataire::factory()->create();
        $prestataireB = Prestataire::factory()->create();

        $reservationA = $this->reservationPour($prestataireA);
        Avis::factory()->create(['id_reservation' => $reservationA->id_reservation, 'note' => 5]);

        $reservationB = $this->reservationPour($prestataireB);
        Avis::factory()->create(['id_reservation' => $reservationB->id_reservation, 'note' => 1]);

        $this->assertEquals(5, $prestataireA->fresh()->note_moyenne);
        $this->assertEquals(1, $prestataireB->fresh()->note_moyenne);
    }

    public function test_un_avis_signale_est_exclu_du_calcul(): void
    {
        $prestataire = Prestataire::factory()->create();

        $reservation1 = $this->reservationPour($prestataire);
        Avis::factory()->create(['id_reservation' => $reservation1->id_reservation, 'note' => 5]);

        $reservation2 = $this->reservationPour($prestataire);
        Avis::factory()->create([
            'id_reservation' => $reservation2->id_reservation,
            'note' => 1,
            'signale' => true,
        ]);

        $this->assertEquals(5, $prestataire->fresh()->note_moyenne);
    }

    public function test_supprimer_un_avis_recalcule_la_moyenne(): void
    {
        $prestataire = Prestataire::factory()->create();

        $reservation1 = $this->reservationPour($prestataire);
        $avis1 = Avis::factory()->create(['id_reservation' => $reservation1->id_reservation, 'note' => 5]);

        $reservation2 = $this->reservationPour($prestataire);
        Avis::factory()->create(['id_reservation' => $reservation2->id_reservation, 'note' => 3]);

        $this->assertEquals(4, $prestataire->fresh()->note_moyenne);

        $avis1->delete();

        $this->assertEquals(3, $prestataire->fresh()->note_moyenne);
    }
}
