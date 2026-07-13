<?php

namespace Tests\Feature\Auth;

use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase;

    public function test_inscription_echoue_si_la_confirmation_du_mot_de_passe_ne_correspond_pas(): void
    {
        $response = $this->postJson('/api/register', [
            'nom' => 'Koné',
            'prenom' => 'Awa',
            'email' => 'awa@example.com',
            'mot_de_passe' => 'password123',
            'mot_de_passe_confirmation' => 'password999',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('mot_de_passe');

        $this->assertDatabaseMissing('utilisateurs', [
            'email' => 'awa@example.com',
        ]);
    }

    public function test_inscription_reussit_si_la_confirmation_correspond(): void
    {
        $response = $this->postJson('/api/register', [
            'nom' => 'Koné',
            'prenom' => 'Awa',
            'email' => 'awa@example.com',
            'mot_de_passe' => 'password123',
            'mot_de_passe_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['user', 'token']);

        $this->assertDatabaseHas('utilisateurs', [
            'email' => 'awa@example.com',
            'role' => 'client',
        ]);
    }

    public function test_inscription_echoue_si_email_deja_utilise(): void
    {
        Utilisateur::factory()->create(['email' => 'awa@example.com']);

        $response = $this->postJson('/api/register', [
            'nom' => 'Koné',
            'prenom' => 'Awa',
            'email' => 'awa@example.com',
            'mot_de_passe' => 'password123',
            'mot_de_passe_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }
}
