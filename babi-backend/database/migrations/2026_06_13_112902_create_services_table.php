<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id('id_service');
            $table->string('nom_service', 100);
            $table->text('description')->nullable();
            $table->string('photo_path')->nullable();
            $table->decimal('tarif', 10, 2);
            $table->boolean('disponibilite')->default(true);
            $table->unsignedBigInteger('id_prestataire');
            $table->foreign('id_prestataire')->references('id_prestataire')->on('prestataires');
            $table->unsignedBigInteger('id_categorie');
            $table->foreign('id_categorie')->references('id_categorie')->on('categories');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
