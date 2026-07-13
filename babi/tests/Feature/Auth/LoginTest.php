<?php

namespace Tests\Feature\Auth;

use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_connexion_reussit_avec_les_bons_identifiants(): void
    {
        $utilisateur = Utilisateur::factory()->create();

        $response = $this->postJson('/api/login', [
            'email' => $utilisateur->email,
            'mot_de_passe' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['user', 'token']);
    }

    public function test_connexion_echoue_avec_un_mauvais_mot_de_passe(): void
    {
        $utilisateur = Utilisateur::factory()->create();

        $response = $this->postJson('/api/login', [
            'email' => $utilisateur->email,
            'mot_de_passe' => 'mauvais-mot-de-passe',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Identifiants incorrects']);
    }

    public function test_connexion_echoue_si_email_inconnu(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'inconnu@example.com',
            'mot_de_passe' => 'password',
        ]);

        $response->assertStatus(401);
    }

    public function test_me_necessite_un_token(): void
    {
        $this->getJson('/api/me')->assertUnauthorized();
    }

    public function test_me_retourne_lutilisateur_connecte(): void
    {
        $utilisateur = Utilisateur::factory()->create();

        $login = $this->postJson('/api/login', [
            'email' => $utilisateur->email,
            'mot_de_passe' => 'password',
        ]);
        $token = $login->json('token');

        $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonFragment(['email' => $utilisateur->email]);
    }

    public function test_logout_invalide_le_token(): void
    {
        $utilisateur = Utilisateur::factory()->create();
        $token = $utilisateur->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/logout')
            ->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
