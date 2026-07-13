<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\UpdateProfilRequest;
use App\Http\Requests\Auth\UpdatePasswordRequest;
use App\Http\Resources\UtilisateurResource;
use App\Models\Utilisateur;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $utilisateur = Utilisateur::create([
            'nom'          => $request->nom,
            'prenom'       => $request->prenom,
            'email'        => $request->email,
            'mot_de_passe' => Hash::make($request->mot_de_passe),
            'telephone'    => $request->telephone,
            'adresse'      => $request->adresse,
            'role'         => 'client',
        ]);

        $token = $utilisateur->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => new UtilisateurResource($utilisateur),
            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $utilisateur = Utilisateur::where('email', $request->email)->first();

        if (!$utilisateur || !Hash::check($request->mot_de_passe, $utilisateur->mot_de_passe)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        $token = $utilisateur->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => new UtilisateurResource($utilisateur),
            'token' => $token,
        ]);
    }

    public function logout(): JsonResponse
    {
        auth('sanctum')->user()->tokens()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    public function me(): JsonResponse
    {
        return response()->json(new UtilisateurResource(auth()->user()));
    }

    public function updateProfil(UpdateProfilRequest $request): JsonResponse
    {
        $utilisateur = auth()->user();
        $utilisateur->update($request->validated());

        return response()->json([
            'message' => 'Profil mis à jour',
            'user' => new UtilisateurResource($utilisateur->fresh()),
        ]);
    }

    public function changePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $utilisateur = auth()->user();

        if (!Hash::check($request->ancien_mot_de_passe, $utilisateur->mot_de_passe)) {
            return response()->json(['message' => 'Ancien mot de passe incorrect'], 422);
        }

        $utilisateur->update(['mot_de_passe' => Hash::make($request->nouveau_mot_de_passe)]);

        return response()->json(['message' => 'Mot de passe modifié avec succès']);
    }
}
