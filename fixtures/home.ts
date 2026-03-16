export const MOCK_BUILDING = {
  name: 'Residence Les Jardins',
  code: 'A4B7K9',
};

export const MOCK_GARDIEN = {
  name: 'Michel Durand',
  phone: '0612345678',
  horaires: 'Lun - Ven : 8h00 - 18h00',
};

export const MOCK_DATES = [
  {
    id: 'ag',
    label: 'Prochaine AG',
    date: 'Jeudi 15 avril 2026 - 18h30',
    detail:
      'Jeudi 15 avril 2026 a 18h30\nSalle polyvalente, RDC\n\nOrdre du jour :\n- Approbation des comptes\n- Travaux facade\n- Questions diverses',
    type: 'calendar' as const,
  },
  {
    id: 'travaux-facade',
    label: 'Debut travaux facade',
    date: 'Lundi 4 mai 2026',
    detail:
      'Ravalement complet de la facade\nEntreprise : SAS Batipro\nDuree estimee : 2 mois\n\nEchafaudages presents cote rue.',
    type: 'works' as const,
  },
];

export const MOCK_ALERTS = [
  {
    id: 'coupure-eau',
    title: "Coupure d'eau prevue",
    subtitle: 'Mercredi 18 mars, de 9h a 12h - Intervention plomberie au sous-sol.',
    detail:
      "Date : Mercredi 18 mars 2026\nHoraires : 9h00 - 12h00\nMotif : Intervention plomberie au sous-sol\n\nPensez a faire des reserves d'eau.",
    type: 'warning' as const,
  },
  {
    id: 'ascenseur',
    title: 'Travaux ascenseur',
    subtitle: "Ascenseur B hors service jusqu'au 20 mars. Utilisez l'ascenseur A.",
    detail:
      "Ascenseur B hors service\nReprise prevue : 20 mars 2026\n\nUtilisez l'ascenseur A en attendant.",
    type: 'info' as const,
  },
  {
    id: 'syndic',
    title: 'Message du syndic',
    subtitle: 'Le reglement interieur mis a jour est disponible dans vos documents.',
    detail:
      'Le reglement interieur a ete mis a jour.\n\nConsultez-le dans l\'onglet "Mon Appart" > Documents.',
    type: 'primary' as const,
  },
];
