export const MOCK_APARTMENT = {
  numero: 'Appt 12B',
  etage: '3eme',
  surface: '68 m²',
  pieces: '3 (T3)',
  type: 'Appartement',
};

export const MOCK_PARKING = {
  numero: '42',
  niveau: 'Sous-sol 1',
  type: 'Interieur',
};

export const MOCK_LOYER = {
  loyer: 850,
  charges: 120,
  total: 970,
};

export const MOCK_PAYMENTS = [
  {
    id: '1',
    month: 'Mars 2026',
    amount: '970 €',
    status: 'en_attente' as const,
    detail:
      'Montant : 970 €\nStatut : A venir\nEcheance : 1 avril 2026\n\nLe paiement en ligne sera bientot disponible.',
  },
  {
    id: '2',
    month: 'Fevrier 2026',
    amount: '970 €',
    status: 'paye' as const,
    detail:
      'Montant : 970 €\nStatut : Paye\nDate de paiement : 28 janvier 2026\n\nQuittance disponible dans Documents.',
  },
  {
    id: '3',
    month: 'Janvier 2026',
    amount: '970 €',
    status: 'paye' as const,
    detail:
      'Montant : 970 €\nStatut : Paye\nDate de paiement : 30 decembre 2025\n\nQuittance disponible dans Documents.',
  },
];

export const MOCK_DOCUMENTS = [
  { name: 'Bail de location', type: 'bail', date: 'Signe le 1 sept. 2024' },
  { name: "Etat des lieux d'entree", type: 'etat_des_lieux', date: '1 sept. 2024' },
  {
    name: 'Attestation assurance',
    type: 'assurance',
    date: "Valide jusqu'au 1 sept. 2026",
  },
  { name: 'Quittance fevrier 2026', type: 'quittance', date: '1 mars 2026' },
];

export const MOCK_OCCUPANTS = [
  { name: 'Valentin Lefevre', initials: 'VL', isPrincipal: true },
  { name: 'Emma Martin', initials: 'EM', isPrincipal: false, phone: '0698765432' },
];
