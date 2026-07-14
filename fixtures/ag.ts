export const MOCK_AG = {
  label: 'Convocation officielle',
  title: 'AG ordinaire',
  date: 'Jeudi 15 avril · 18h30',
  place: "Salle polyvalente, RDC · 12 résolutions à l'ordre du jour",
  pdfLabel: 'Convocation PDF',
};

// Vote en ligne : aperçu P1 (badge « BIENTÔT »), réservé aux copropriétaires.
export const MOCK_AG_VOTE = {
  resolutionNumber: 'Résolution n°4',
  resolutionTitle: 'Installation de bornes de recharge électrique',
  options: ['Pour', 'Contre', 'Abstention'] as const,
  mention: 'Vote par correspondance dématérialisé · tantièmes : 250/10000',
};

export const MOCK_AG_DOCUMENTS = [
  {
    id: 'ordre-du-jour',
    title: 'Ordre du jour — 12 résolutions',
    subtitle: 'PDF · 240 Ko',
  },
  {
    id: 'devis-ravalement',
    title: 'Devis ravalement façade (3 devis)',
    subtitle: 'PDF · 1,2 Mo',
  },
  {
    id: 'pv-2025',
    title: "PV de l'AG 2025",
    subtitle: 'PDF · 480 Ko',
  },
];
