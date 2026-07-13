<?php

namespace Database\Factories;

use App\Models\Categorie;
use App\Models\Prestataire;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Prestataire>
 */
class PrestataireFactory extends Factory
{
    protected $model = Prestataire::class;

    public function definition(): array
    {
        return [
            'nom' => fake()->lastName(),
            'prenom' => fake()->firstName(),
            'email' => fake()->unique()->safeEmail(),
            'telephone' => fake()->numerify('07########'),
            'localisation' => fake()->city(),
            'note_moyenne' => 0,
            'statut' => 'valide',
            'id_categorie' => Categorie::factory(),
        ];
    }

    public function enAttente(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'en_attente',
        ]);
    }
}
