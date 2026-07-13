<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Utilisateur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

        return response()->json(['user' => $utilisateur, 'token' => $token], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $utilisateur = Utilisateur::where('email', $request->email)->first();

        if (!$utilisateur || !Hash::check($request->mot_de_passe, $utilisateur->mot_de_passe)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        $token = $utilisateur->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => $utilisateur, 'token' => $token]);
    }

    public function logout(): JsonResponse
   {
        auth('sanctum')->user()->tokens()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    public function me(): JsonResponse
    {
        return response()->json(auth()->user());
    }

    public function updateProfil(Request $request): JsonResponse
    {
        $utilisateur = auth()->user();

        $data = $request->validate([
            'nom'       => 'required|string|max:100',
            'prenom'    => 'required|string|max:100',
            'email'     => 'required|email|unique:utilisateurs,email,' . $utilisateur->id_utilisateur . ',id_utilisateur',
            'telephone' => 'nullable|string|max:20',
            'adresse'   => 'nullable|string|max:255',
        ]);

        $utilisateur->update($data);

        return response()->json(['message' => 'Profil mis à jour', 'user' => $utilisateur->fresh()]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $utilisateur = auth()->user();

        $request->validate([
            'ancien_mot_de_passe'    => 'required|string',
            'nouveau_mot_de_passe'   => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->ancien_mot_de_passe, $utilisateur->mot_de_passe)) {
            return response()->json(['message' => 'Ancien mot de passe incorrect'], 422);
        }

        $utilisateur->update(['mot_de_passe' => Hash::make($request->nouveau_mot_de_passe)]);

        return response()->json(['message' => 'Mot de passe modifié avec succès']);
    }
}