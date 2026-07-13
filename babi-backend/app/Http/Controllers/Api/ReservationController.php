<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Http\Requests\Reservation\StoreReservationRequest;
use App\Http\Requests\Reservation\UpdateReservationRequest;
use App\Http\Resources\ReservationResource;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Reservation::with(['utilisateur', 'service.prestataire', 'avis'])
            ->orderByDesc('date_reservation');

        if (auth()->user()?->role !== 'admin') {
            $query->where('id_utilisateur', auth()->id());
        }

        return ReservationResource::collection($query->paginate(15));
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
        $reservation->load(['utilisateur', 'service.prestataire']);

        return (new ReservationResource($reservation))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $reservation = Reservation::with(['utilisateur', 'service.prestataire', 'avis'])->findOrFail($id);

        $estProprietaire = $reservation->id_utilisateur === auth()->id();
        $estAdmin = auth()->user()?->role === 'admin';
        abort_if(! $estProprietaire && ! $estAdmin, 403);

        return new ReservationResource($reservation);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReservationRequest $request, string $id)
    {
        $reservation = Reservation::findOrFail($id);

        if (auth()->user()?->role === 'admin') {
            $reservation->update($request->validated());
            return new ReservationResource($reservation->fresh(['utilisateur', 'service.prestataire']));
        }

        abort_if($reservation->id_utilisateur !== auth()->id(), 403);
        $reservation->update($request->safe()->except('id_utilisateur'));
        return new ReservationResource($reservation->fresh(['utilisateur', 'service.prestataire']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $reservation = Reservation::findOrFail($id);

        $estProprietaire = $reservation->id_utilisateur === auth()->id();
        $estAdmin = auth()->user()?->role === 'admin';
        abort_if(! $estProprietaire && ! $estAdmin, 403);

        $reservation->delete();
        return response()->json(['message' => 'Réservation supprimée']);
    }
}
