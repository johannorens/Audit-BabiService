<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: sans-serif; color: #1a1a1a;">
    <h2 style="color: #059669;">Bonjour {{ $service->prestataire->prenom }},</h2>

    <p>Bonne nouvelle : votre profil a été validé et votre annonce est maintenant visible sur Babi Services.</p>

    <table style="margin: 16px 0; border-collapse: collapse;">
        <tr>
            <td style="padding: 4px 12px 4px 0; color: #6b7280;">Annonce</td>
            <td style="padding: 4px 0; font-weight: bold;">{{ $service->nom_service }}</td>
        </tr>
        <tr>
            <td style="padding: 4px 12px 4px 0; color: #6b7280;">Catégorie</td>
            <td style="padding: 4px 0;">{{ $service->categorie->nom_categorie ?? '—' }}</td>
        </tr>
        <tr>
            <td style="padding: 4px 12px 4px 0; color: #6b7280;">Tarif</td>
            <td style="padding: 4px 0;">{{ number_format($service->tarif, 0, ',', ' ') }} F</td>
        </tr>
    </table>

    <p>Vous pouvez désormais recevoir des demandes de réservation de la part des clients. Notre équipe vous contactera pour toute information complémentaire.</p>

    <p>À bientôt,<br>L'équipe Babi Services</p>
</body>
</html>
