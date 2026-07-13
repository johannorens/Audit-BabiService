<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prestataire;
use App\Models\Utilisateur;
use App\Models\Reservation;
use App\Models\Avis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_utilisateurs' => Utilisateur::count(),
            'total_prestataires' => Prestataire::where('statut', 'valide')->count(),
            'reservations_mois'  => Reservation::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'volume_traite'      => DB::table('reservations')
                ->join('services', 'reservations.id_service', '=', 'services.id_service')
                ->whereMonth('reservations.created_at', now()->month)
                ->sum('services.tarif'),
        ];

        $reservations_par_mois = Reservation::whereYear('created_at', now()->year)
            ->get()
            ->groupBy(fn ($r) => $r->created_at->month)
            ->map->count()
            ->sortKeys()
            ->map(fn ($total, $mois) => ['mois' => $mois, 'total' => $total])
            ->values();

        $activite_recente = [
            'derniers_utilisateurs'  => Utilisateur::latest()->limit(5)->get(),
            'dernieres_reservations' => Reservation::where('statut', 'confirmee')->latest()->limit(5)->get(),
            'derniers_avis'          => Avis::latest()->limit(5)->get(),
        ];

        $a_valider = Prestataire::with('categorie')
            ->where('statut', 'en_attente')
            ->latest()
            ->get();

        return response()->json([
            'stats'                 => $stats,
            'reservations_par_mois' => $reservations_par_mois,
            'activite_recente'      => $activite_recente,
            'a_valider'             => $a_valider,
        ]);
    }

    public function validerPrestataire(string $id)
    {
        $prestataire = Prestataire::findOrFail($id);
        $prestataire->update(['statut' => 'valide']);
        return response()->json(['message' => 'Prestataire validé']);
    }

    public function rejeterPrestataire(string $id)
    {
        $prestataire = Prestataire::findOrFail($id);
        $prestataire->update(['statut' => 'rejete']);
        return response()->json(['message' => 'Prestataire rejeté']);
    }

    public function utilisateurs()
    {
        $utilisateurs = Utilisateur::withCount('reservations')->latest()->get();
        $prestataires = Prestataire::with('categorie')->latest()->get();

        return response()->json([
            'utilisateurs' => $utilisateurs,
            'prestataires' => $prestataires,
        ]);
    }

    public function deleteUtilisateur(string $id, Request $request)
    {
        $utilisateur = Utilisateur::findOrFail($id);

        if ($utilisateur->id_utilisateur === $request->user()->id_utilisateur) {
            return response()->json(['message' => 'Impossible de supprimer votre propre compte'], 403);
        }

        if ($utilisateur->reservations()->count() > 0) {
            return response()->json(['message' => 'Impossible de supprimer un utilisateur ayant des réservations'], 422);
        }

        $utilisateur->tokens()->delete();
        $utilisateur->delete();

        return response()->json(['message' => 'Utilisateur supprimé']);
    }

    public function deletePrestataire(string $id)
    {
        $prestataire = Prestataire::findOrFail($id);
        $prestataire->delete();
        return response()->json(['message' => 'Prestataire supprimé']);
    }

    public function missions()
    {
        $missions = Reservation::with(['utilisateur', 'service.prestataire'])
            ->latest()
            ->get()
            ->map(fn($r) => [
                'id'          => $r->id_reservation,
                'service'     => $r->service?->nom_service,
                'client'      => trim(($r->utilisateur?->prenom ?? '') . ' ' . ($r->utilisateur?->nom ?? '')),
                'prestataire' => trim(($r->service?->prestataire?->prenom ?? '') . ' ' . ($r->service?->prestataire?->nom ?? '')),
                'date'        => $r->created_at,
                'montant'     => $r->service?->tarif,
                'statut'      => $r->statut,
            ]);

        return response()->json($missions);
    }
}
