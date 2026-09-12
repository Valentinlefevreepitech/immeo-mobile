// ─────────────────────────────────────────────────────────────
// Entraide entre voisins (Phase 6) — prets d'objets/services,
// sans intervention du syndic. Coordonnees partagees uniquement
// apres acceptation.
// ─────────────────────────────────────────────────────────────

export type EntraideCategorie = 'Bricolage' | 'Cuisine' | 'Services' | 'Autres';
export type EntraideType = 'objet' | 'service';
export type EntraideStatutOffre = 'disponible' | 'emprunte';

export interface EntraideOffer {
  id: string;
  type: EntraideType;
  titre: string;
  categorie: EntraideCategorie;
  icon: 'wrench' | 'utensils' | 'hammer' | 'hand-helping' | 'package';
  proprietaire: { nom: string; initials: string; etage: string; role?: 'gardien' };
  condition: string;
  ctaLabel: string;
  statut: EntraideStatutOffre;
  demandeEnvoyee: boolean;
  description: string;
  conditions: string[];
  dejaReserve: { dateLabel: string }[];
  note?: string;
  nbPrets?: number;
}

export const MOCK_OFFERS: EntraideOffer[] = [
  {
    id: 'tournevis',
    type: 'objet',
    titre: 'Tournevis électrique',
    categorie: 'Bricolage',
    icon: 'wrench',
    proprietaire: { nom: 'Sophie M.', initials: 'SM', etage: '3ème' },
    condition: 'prêt 48h',
    ctaLabel: 'Demander',
    statut: 'disponible',
    demandeEnvoyee: false,
    description: "Tournevis électrique sans fil, avec jeu d'embouts. Batterie chargée.",
    conditions: ['Durée max : 48h', 'Retrait : porte 3ème étage', 'Pas de caution'],
    dejaReserve: [],
  },
  {
    id: 'raclette',
    type: 'objet',
    titre: 'Appareil à raclette 8 pers.',
    categorie: 'Cuisine',
    icon: 'utensils',
    proprietaire: { nom: 'Michel Durand', initials: 'MD', etage: 'Loge RDC', role: 'gardien' },
    condition: 'à réserver',
    ctaLabel: 'Réserver',
    statut: 'disponible',
    demandeEnvoyee: false,
    description:
      'Appareil à raclette 8 personnes avec poêlons individuels. Idéal pour les soirées entre voisins.',
    conditions: ['Durée max : 1 week-end', 'Retrait : loge, RDC', 'Caution : 20 €'],
    dejaReserve: [{ dateLabel: '21-22 mars' }, { dateLabel: '28-29 mars' }],
    note: '★ 4,9',
    nbPrets: 6,
  },
  {
    id: 'echelle',
    type: 'objet',
    titre: 'Échelle 2 m',
    categorie: 'Bricolage',
    icon: 'hammer',
    proprietaire: { nom: 'Karim B.', initials: 'KB', etage: '5ème' },
    condition: 'retour le 20 mars',
    ctaLabel: 'Demander',
    statut: 'emprunte',
    demandeEnvoyee: false,
    description: 'Échelle télescopique 2 mètres, pliable.',
    conditions: ['Durée max : 1 semaine', 'Retrait : 5ème étage', 'Pas de caution'],
    dejaReserve: [],
  },
  {
    id: 'demenagement',
    type: 'service',
    titre: 'Coup de main déménagement',
    categorie: 'Services',
    icon: 'hand-helping',
    proprietaire: { nom: 'Emma M.', initials: 'EM', etage: '3ème' },
    condition: 'samedi matin',
    ctaLabel: 'Je participe',
    statut: 'disponible',
    demandeEnvoyee: false,
    description: 'Besoin de bras pour descendre quelques meubles samedi matin, vers 9h.',
    conditions: ['Samedi matin, ~2h', 'RDV devant le hall'],
    dejaReserve: [],
  },
];

export interface DemandeRecue {
  id: string;
  demandeur: { nom: string; initials: string; etage: string; telephone: string };
  offerTitre: string;
  dateLabel: string;
  message: string;
  statut: 'pending' | 'accepted' | 'refused';
}

export const MOCK_DEMANDES_RECUES: DemandeRecue[] = [
  {
    id: '1',
    demandeur: { nom: 'Karim B.', initials: 'KB', etage: '5ème', telephone: '06 12 34 56 78' },
    offerTitre: 'Appareil à raclette 8 pers.',
    dateLabel: 'Pour le 4-5 avril',
    message: 'Salut Michel, je peux emprunter la raclette ce week-end ?',
    statut: 'pending',
  },
];

export interface MaDemande {
  id: string;
  offerTitre: string;
  proprietaireNom: string;
  dateLabel: string;
  statut: 'pending' | 'accepted';
}

export const MOCK_MES_DEMANDES: MaDemande[] = [
  {
    id: '1',
    offerTitre: 'Perceuse',
    proprietaireNom: 'Sophie M.',
    dateLabel: 'Rendue le 2 mars',
    statut: 'accepted',
  },
  {
    id: '2',
    offerTitre: 'Nettoyeur vapeur',
    proprietaireNom: 'Emma M.',
    dateLabel: 'À traiter',
    statut: 'pending',
  },
];

export interface MonAnnonce {
  id: string;
  titre: string;
  statut: 'en_ligne' | 'masquee';
}

export const MOCK_MES_ANNONCES: MonAnnonce[] = [
  { id: '1', titre: 'Perceuse', statut: 'en_ligne' },
  { id: '2', titre: 'Nettoyeur vapeur', statut: 'masquee' },
];

export const ENTRAIDE_CATEGORIES: readonly EntraideCategorie[] = [
  'Bricolage',
  'Cuisine',
  'Services',
  'Autres',
];

export const ENTRAIDE_DUREES = ['Quelques heures', '48h', '1 semaine'] as const;
