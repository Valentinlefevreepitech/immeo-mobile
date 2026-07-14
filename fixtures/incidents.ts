import type { IncidentStatus } from '@/types/database';

export interface MockIncident {
  id: string;
  title: string;
  category: string;
  date: string;
  status: IncidentStatus;
}

export const MOCK_INCIDENTS: MockIncident[] = [
  {
    id: '1',
    title: 'Fuite robinet cuisine',
    category: 'Plomberie',
    date: '12 mars',
    status: 'En cours',
  },
  {
    id: '2',
    title: 'Prise electrique HS salon',
    category: 'Electricite',
    date: '5 mars',
    status: 'En attente',
  },
  {
    id: '3',
    title: 'Chauffage faible chambre',
    category: 'Chauffage',
    date: '20 fev.',
    status: 'Résolu',
  },
];

export const MOCK_TRAVAUX = [
  {
    id: '1',
    title: 'Ravalement facade',
    entreprise: 'SAS Batipro',
    status: 'en_cours' as const,
    startDate: '1 mars 2026',
    endDate: '30 avril 2026',
    detail:
      'Entreprise : SAS Batipro\nStatut : En cours\nDebut : 1 mars 2026\nFin prevue : 30 avril 2026\n\nEchafaudages presents cote rue. Acces principal maintenu.',
  },
  {
    id: '2',
    title: 'Remplacement chaudiere collective',
    entreprise: 'Thermitech',
    status: 'planifie' as const,
    startDate: '15 mai 2026',
    detail:
      'Entreprise : Thermitech\nStatut : Planifie\nDebut prevu : 15 mai 2026\n\nCoupure de chauffage et eau chaude possible pendant 48h.',
  },
];

export const MOCK_SYNDIC = {
  name: 'Cabinet Foncia',
  phone: '0123456789',
  email: 'contact@foncia.fr',
};

// ─────────────────────────────────────────────────────────────
// Prototype v2 : statuts `declare → pris_en_compte → intervention → resolu`
// ─────────────────────────────────────────────────────────────

export type IncidentStatusV2 =
  | 'declare'
  | 'pris_en_compte'
  | 'intervention'
  | 'resolu'
  | 'en_cours';

export interface IncidentV2 {
  id: string;
  title: string;
  subtitle: string;
  status: IncidentStatusV2;
  pulse?: boolean;
}

export const INCIDENT_CATEGORIES = [
  'Plomberie',
  'Électricité',
  'Chauffage',
  'Serrurerie',
  'Autre',
] as const;

export const MOCK_MES_SIGNALEMENTS: IncidentV2[] = [
  {
    id: 'fuite-robinet',
    title: 'Fuite robinet cuisine',
    subtitle: 'Plomberie · privatif · 12 mars',
    status: 'intervention',
  },
  {
    id: 'prise-hs',
    title: 'Prise électrique HS salon',
    subtitle: 'Électricité · privatif · 5 mars',
    status: 'declare',
    pulse: true,
  },
  {
    id: 'chauffage-faible',
    title: 'Chauffage faible chambre',
    subtitle: 'Chauffage · privatif · 20 fév.',
    status: 'resolu',
  },
];

export const MOCK_INCIDENTS_IMMEUBLE: IncidentV2[] = [
  {
    id: 'ascenseur-b',
    title: 'Ascenseur B hors service',
    subtitle: 'Parties communes · reprise le 20 mars',
    status: 'en_cours',
  },
];

export interface IncidentTimelineStep {
  label: string;
  date: string;
  state: 'done' | 'current' | 'pending';
}

export interface IncidentComment {
  id: string;
  from: 'syndic' | 'resident';
  initials?: string;
  text: string;
}

export const MOCK_INCIDENT_DETAIL = {
  id: 'fuite-robinet',
  title: 'Fuite robinet cuisine',
  subtitle: 'Plomberie · privatif · déclaré le 12 mars',
  status: 'intervention' as IncidentStatusV2,
  photos: 2,
  timeline: [
    { label: 'Déclaré', date: '12 mars, 10:24', state: 'done' },
    {
      label: 'Pris en compte par le syndic',
      date: '12 mars, 16:02 · Cabinet Foncia',
      state: 'done',
    },
    {
      label: 'Intervention planifiée',
      date: 'Plombier · mercredi 19 mars, 9h – 12h',
      state: 'current',
    },
    { label: 'Résolu', date: '', state: 'pending' },
  ] as IncidentTimelineStep[],
  comments: [
    {
      id: '1',
      from: 'syndic',
      initials: 'CF',
      text: "Pouvez-vous préciser si la fuite est continue ou seulement à l'ouverture ?",
    },
    {
      id: '2',
      from: 'resident',
      text: "Continue, j'ai coupé l'arrivée d'eau sous l'évier.",
    },
  ] as IncidentComment[],
};
