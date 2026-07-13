<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\Service;
use App\Models\Utilisateur;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reservation>
 */
class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    public function definition(): array
    {
        return [
            'date_reservation' => fake()->date(),
            'heure_reservation' => fake()->time('H:i'),
            'statut' => 'confirmee',
            'id_utilisateur' => Utilisateur::factory(),
            'id_service' => Service::factory(),
        ];
    }

    public function terminee(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'terminee',
        ]);
    }
}
