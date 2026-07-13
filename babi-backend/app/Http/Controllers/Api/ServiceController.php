<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\AnnoncePublieeMail;
use App\Models\Service;
use App\Http\Requests\Service\StoreServiceRequest;
use App\Http\Requests\Service\UpdateServiceRequest;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Service::with(['prestataire', 'categorie'])->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServiceRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $uploadDir = public_path('uploads/services');
            File::ensureDirectoryExists($uploadDir);
            $filename = time() . '_' . Str::random(8) . '.' . $photo->getClientOriginalExtension();
            $photo->move($uploadDir, $filename);
            $data['photo_path'] = asset('uploads/services/' . $filename);
        }

        $service = Service::create($data);
        $service->load(['prestataire', 'categorie']);

        if ($service->prestataire?->email) {
            Mail::to($service->prestataire->email)->send(new AnnoncePublieeMail($service));
        }

        return response()->json($service, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $service = Service::with(['prestataire', 'categorie', 'reservations'])->findOrFail($id);
        return response()->json($service);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServiceRequest $request, string $id)
    {
        $service = Service::findOrFail($id);
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $uploadDir = public_path('uploads/services');
            File::ensureDirectoryExists($uploadDir);
            $filename = time() . '_' . Str::random(8) . '.' . $photo->getClientOriginalExtension();
            $photo->move($uploadDir, $filename);
            $data['photo_path'] = asset('uploads/services/' . $filename);
        }

        $service->update($data);
        return response()->json($service);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $service = Service::findOrFail($id);
        $service->delete();
        return response()->json(['message' => 'Service supprimé']);
    }
}