<?php

namespace Database\Factories;

use App\Models\Avis;
use App\Models\Reservation;
use App\Models\Utilisateur;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Avis>
 */
class AvisFactory extends Factory
{
    protected $model = Avis::class;

    public function definition(): array
    {
        return [
            'note' => fake()->numberBetween(1, 5),
            'commentaire' => fake()->sentence(),
            'date_avis' => fake()->date(),
            'signale' => false,
            'id_utilisateur' => Utilisateur::factory(),
            'id_reservation' => Reservation::factory()->terminee(),
        ];
    }
}
