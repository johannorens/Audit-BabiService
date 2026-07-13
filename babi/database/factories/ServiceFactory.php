<?php

namespace Database\Factories;

use App\Models\Categorie;
use App\Models\Prestataire;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        return [
            'nom_service' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'tarif' => fake()->randomFloat(2, 1000, 50000),
            'disponibilite' => true,
            'id_prestataire' => Prestataire::factory(),
            'id_categorie' => Categorie::factory(),
        ];
    }
}
