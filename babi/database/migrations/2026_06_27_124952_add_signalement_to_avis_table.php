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
        Schema::table('avis', function (Blueprint $table) {
            $table->boolean('signale')->default(false);
            $table->string('motif_signalement')->nullable();
            $table->unsignedBigInteger('signale_par')->nullable();
            $table->foreign('signale_par')->references('id_utilisateur')->on('utilisateurs')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('avis', function (Blueprint $table) {
            $table->dropForeign(['signale_par']);
            $table->dropColumn(['signale', 'motif_signalement', 'signale_par']);
        });
    }
};
