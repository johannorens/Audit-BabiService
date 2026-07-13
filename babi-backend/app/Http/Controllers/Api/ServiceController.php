<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\AnnoncePublieeMail;
use App\Models\Service;
use App\Http\Requests\Service\StoreServiceRequest;
use App\Http\Requests\Service\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
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
        return ServiceResource::collection(
            Service::with(['prestataire', 'categorie'])->paginate(15)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServiceRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $data['photo_path'] = $this->enregistrerPhoto($request->file('photo'));
        }

        $service = Service::create($data);
        $service->load(['prestataire', 'categorie']);

        if ($service->prestataire?->email) {
            Mail::to($service->prestataire->email)->send(new AnnoncePublieeMail($service));
        }

        return (new ServiceResource($service))->response()->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $service = Service::with(['prestataire', 'categorie', 'reservations'])->findOrFail($id);
        return new ServiceResource($service);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServiceRequest $request, string $id)
    {
        $service = Service::findOrFail($id);
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $this->supprimerAnciennePhoto($service);
            $data['photo_path'] = $this->enregistrerPhoto($request->file('photo'));
        }

        $service->update($data);
        return new ServiceResource($service->fresh(['prestataire', 'categorie']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $service = Service::findOrFail($id);
        $this->supprimerAnciennePhoto($service);
        $service->delete();
        return response()->json(['message' => 'Service supprimé']);
    }

    /**
     * Enregistre la photo uploadée et retourne son URL publique.
     */
    private function enregistrerPhoto($photo): string
    {
        $uploadDir = public_path('uploads/services');
        File::ensureDirectoryExists($uploadDir);
        $filename = time() . '_' . Str::random(8) . '.' . $photo->getClientOriginalExtension();
        $photo->move($uploadDir, $filename);

        return asset('uploads/services/' . $filename);
    }

    /**
     * Supprime le fichier physique de l'ancienne photo pour éviter les fichiers orphelins.
     */
    private function supprimerAnciennePhoto(Service $service): void
    {
        if (! $service->photo_path) {
            return;
        }

        $filename = basename(parse_url($service->photo_path, PHP_URL_PATH));
        $path = public_path('uploads/services/' . $filename);

        if (File::exists($path)) {
            File::delete($path);
        }
    }
}
