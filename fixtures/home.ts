export const MOCK_BUILDING = {
  name: 'Résidence Les Jardins',
  code: 'A4B7K9',
};

// ── Prototype v2 : section « À venir » (date-chips) ──
export const MOCK_UPCOMING = [
  {
    id: 'ag',
    month: 'avr',
    day: '15',
    title: 'Assemblée générale',
    subtitle: 'Convocation disponible · 18h30',
    accent: true,
    route: '/ag' as const,
  },
  {
    id: 'travaux-facade',
    month: 'mai',
    day: '04',
    title: 'Début travaux façade',
    subtitle: 'SAS Batipro · 2 mois',
    accent: false,
  },
];

// ── Prototype v2 : section « Alertes » (dot + titre + sous-titre) ──
export const MOCK_HOME_ALERTS = [
  {
    id: 'coupure-eau',
    title: "Coupure d'eau prévue",
    subtitle: 'Mer. 18 mars, 9h – 12h · Plomberie sous-sol',
    color: 'warning' as const,
    pulse: true,
  },
  {
    id: 'syndic',
    title: 'Message du syndic',
    subtitle: 'Règlement intérieur mis à jour',
    color: 'primary' as const,
    pulse: false,
  },
];

export const MOCK_GARDIEN = {
  name: 'Michel Durand',
  phone: '0612345678',
  horaires: 'Lun - Ven : 8h00 - 18h00',
};
