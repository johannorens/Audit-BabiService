<?php

namespace Tests\Unit;

use App\Models\Avis;
use App\Models\Reservation;
use App\Models\Utilisateur;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UtilisateurModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_auth_password_retourne_mot_de_passe(): void
    {
        $utilisateur = Utilisateur::factory()->create();

        $this->assertSame($utilisateur->mot_de_passe, $utilisateur->getAuthPassword());
    }

    public function test_role_par_defaut_est_client(): void
    {
        $utilisateur = Utilisateur::factory()->create();

        $this->assertSame('client', $utilisateur->role);
    }

    public function test_factory_admin_cree_un_admin(): void
    {
        $admin = Utilisateur::factory()->admin()->create();

        $this->assertSame('admin', $admin->role);
    }

    public function test_mot_de_passe_est_exclu_du_tableau(): void
    {
        $utilisateur = Utilisateur::factory()->create();

        $this->assertArrayNotHasKey('mot_de_passe', $utilisateur->toArray());
    }

    public function test_relation_reservations_est_has_many(): void
    {
        $utilisateur = Utilisateur::factory()->create();

        $this->assertInstanceOf(HasMany::class, $utilisateur->reservations());
    }

    public function test_relation_reservations_retourne_uniquement_celles_du_client(): void
    {
        $client = Utilisateur::factory()->create();
        $autre  = Utilisateur::factory()->create();
        Reservation::factory()->count(2)->create(['id_utilisateur' => $client->id_utilisateur]);
        Reservation::factory()->create(['id_utilisateur' => $autre->id_utilisateur]);

        $this->assertCount(2, $client->reservations);
    }

    public function test_relation_avis_est_has_many(): void
    {
        $utilisateur = Utilisateur::factory()->create();

        $this->assertInstanceOf(HasMany::class, $utilisateur->avis());
    }

    public function test_update_profil_modifie_les_champs(): void
    {
        $utilisateur = Utilisateur::factory()->create(['nom' => 'Ancien']);

        $utilisateur->update(['nom' => 'Nouveau', 'prenom' => 'Prénom', 'email' => $utilisateur->email]);

        $this->assertSame('Nouveau', $utilisateur->fresh()->nom);
    }

    public function test_changement_de_mot_de_passe_est_hache(): void
    {
        $utilisateur = Utilisateur::factory()->create();
        $nouveau = 'nouveauSecret123';

        $utilisateur->update(['mot_de_passe' => Hash::make($nouveau)]);

        $this->assertTrue(Hash::check($nouveau, $utilisateur->fresh()->mot_de_passe));
    }

    public function test_ancien_mot_de_passe_incorrect_ne_correspond_pas(): void
    {
        $utilisateur = Utilisateur::factory()->create();

        $this->assertFalse(Hash::check('mauvais', $utilisateur->mot_de_passe));
    }
}
