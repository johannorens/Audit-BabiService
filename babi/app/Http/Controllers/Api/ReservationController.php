<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Http\Requests\Reservation\StoreReservationRequest;
use App\Http\Requests\Reservation\UpdateReservationRequest;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (auth()->user()?->role === 'admin') {
            return response()->json(
                Reservation::with(['utilisateur', 'service.prestataire', 'avis'])
                    ->orderByDesc('date_reservation')
                    ->get()
            );
        }

        return response()->json(
            Reservation::with(['utilisateur', 'service.prestataire', 'avis'])
                ->where('id_utilisateur', auth()->id())
                ->orderByDesc('date_reservation')
                ->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReservationRequest $request)
    {
        
        $reservation = Reservation::create([
            ...$request->validated(),
            'id_utilisateur' => auth()->id(),
            'statut' => 'confirmee',
        ]);
        return response()->json($reservation, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $reservation = Reservation::with(['utilisateur', 'service.prestataire', 'avis'])->findOrFail($id);
        abort_if($reservation->id_utilisateur !== auth()->id(), 403);
        return response()->json($reservation);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReservationRequest $request, string $id)
    {
        $reservation = Reservation::findOrFail($id);

        if (auth()->user()?->role === 'admin') {
            $reservation->update($request->validated());
            return response()->json($reservation->fresh());
        }

        abort_if($reservation->id_utilisateur !== auth()->id(), 403);
        $reservation->update($request->safe()->except('id_utilisateur'));
        return response()->json($reservation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $reservation = Reservation::findOrFail($id);
        abort_if($reservation->id_utilisateur !== auth()->id(), 403);
        $reservation->delete();
        return response()->json(['message' => 'Réservation supprimée']);
    }
}
