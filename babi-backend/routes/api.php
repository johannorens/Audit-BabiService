<?php

use App\Http\Controllers\Api\PrestaireController;
use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\AvisController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me',      [AuthController::class, 'me']);
    Route::put('profil',          [AuthController::class, 'updateProfil']);
    Route::put('profil/password', [AuthController::class, 'changePassword']);
    Route::apiResource('reservations', ReservationController::class);
    Route::apiResource('avis', AvisController::class);
    Route::post('avis/{id}/signaler', [AvisController::class, 'signaler']);
});

Route::apiResource('prestataires', PrestaireController::class)->only(['index', 'show']);
Route::post('prestataires/candidature', [PrestaireController::class, 'candidater']);
Route::apiResource('categories', CategorieController::class)->only(['index', 'show']);
Route::apiResource('services',   ServiceController::class)->only(['index', 'show']);
Route::get('services/{id}/avis', [AvisController::class, 'parService']);

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::apiResource('prestataires', PrestaireController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('categories',   CategorieController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('services',     ServiceController::class)->only(['store', 'update', 'destroy']);

    Route::prefix('admin')->group(function () {
        Route::get('dashboard',                          [AdminDashboardController::class, 'index']);
        Route::patch('prestataires/{id}/valider',        [AdminDashboardController::class, 'validerPrestataire']);
        Route::patch('prestataires/{id}/rejeter',        [AdminDashboardController::class, 'rejeterPrestataire']);
        Route::get('utilisateurs',                       [AdminDashboardController::class, 'utilisateurs']);
        Route::delete('utilisateurs/{id}',               [AdminDashboardController::class, 'deleteUtilisateur']);
        Route::delete('utilisateurs/prestataires/{id}',  [AdminDashboardController::class, 'deletePrestataire']);
        Route::get('missions',                           [AdminDashboardController::class, 'missions']);
    });
});