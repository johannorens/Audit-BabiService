<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Avis;
use App\Models\Reservation;
use App\Http\Requests\Avis\StoreAvisRequest;
use App\Http\Requests\Avis\UpdateAvisRequest;
use Illuminate\Http\Request;

class AvisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(
            Avis::with(['utilisateur', 'reservation'])
                ->where('id_utilisateur', auth()->id())
                ->get()
        );
    }

    /**
     * Liste les avis publiés (non signalés) pour un service donné.
     */
    public function parService(string $id_service)
    {
        return response()->json(
            Avis::with('utilisateur')
                ->where('signale', false)
                ->whereHas('reservation', fn ($q) => $q->where('id_service', $id_service))
                ->orderByDesc('date_avis')
                ->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAvisRequest $request)
    {
        $reservation = Reservation::findOrFail($request->validated()['id_reservation']);
        abort_if($reservation->id_utilisateur !== auth()->id(), 403);
        abort_if($reservation->statut !== 'terminee', 422, "La réservation doit être terminée avant de pouvoir laisser un avis.");

        $avis = Avis::create([
            ...$request->validated(),
            'id_utilisateur' => auth()->id(),
        ]);
        return response()->json($avis, 201);
    }

    /**
     * Signale un avis comme inapproprié. Il est alors masqué de la liste publique
     * et exclu du calcul de la note moyenne, en attente de modération.
     */
    public function signaler(Request $request, string $id)
    {
        $request->validate([
            'motif' => 'required|string|max:255',
        ]);

        $avis = Avis::findOrFail($id);
        abort_if($avis->id_utilisateur === auth()->id(), 422, "Vous ne pouvez pas signaler votre propre avis.");

        $avis->update([
            'signale' => true,
            'motif_signalement' => $request->input('motif'),
            'signale_par' => auth()->id(),
        ]);

        return response()->json(['message' => 'Avis signalé, il sera examiné par un modérateur.']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $avis = Avis::with(['utilisateur', 'reservation'])->findOrFail($id);
        abort_if($avis->id_utilisateur !== auth()->id(), 403);
        return response()->json($avis);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAvisRequest $request, string $id)
    {
        $avis = Avis::findOrFail($id);
        abort_if($avis->id_utilisateur !== auth()->id(), 403);
        $avis->update($request->validated());
        return response()->json($avis);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $avis = Avis::findOrFail($id);
        abort_if($avis->id_utilisateur !== auth()->id(), 403);
        $avis->delete();
        return response()->json(['message' => 'Avis supprimé']);
    }
}
