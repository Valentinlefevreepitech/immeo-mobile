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
