// ─────────────────────────────────────────────────────────────
// Sondages entre voisins (Phase 5) — informels, sans valeur AG.
// ─────────────────────────────────────────────────────────────

export type SondagePortee = 'immeuble' | 'etage';
export type SondageDuree = 3 | 7 | 14;

export interface SondageOption {
  id: string;
  label: string;
  votes: number;
}

export interface SondageComment {
  id: string;
  author: string;
  role: 'voisin' | 'gardien';
  initials: string;
  text: string;
}

export interface Sondage {
  id: string;
  auteur: { nom: string; initials: string; etage: string };
  question: string;
  contexte: string;
  options: SondageOption[];
  dureeJours: SondageDuree;
  portee: SondagePortee;
  anonyme: boolean;
  commentairesActifs: boolean;
  totalLots: number;
  clotureLabel: string;
  ouvertDepuisLabel: string;
  status: 'actif' | 'clos';
  monVote: string | null;
  comments: SondageComment[];
  winningOptionId?: string;
}

export const MOCK_SONDAGE_ACTIF: Sondage = {
  id: 'compost-cour',
  auteur: { nom: 'Sophie M.', initials: 'SM', etage: '3ème' },
  question: 'Installer un composteur partagé dans la cour ?',
  contexte:
    "Le syndic a donne son accord de principe. Il faudrait juste s'organiser pour l'entretien.",
  options: [
    { id: 'pour', label: 'Pour, je participerai', votes: 14 },
    { id: 'pour-sans', label: 'Pour, mais sans participer', votes: 6 },
    { id: 'contre', label: 'Contre', votes: 3 },
  ],
  dureeJours: 7,
  portee: 'immeuble',
  anonyme: false,
  commentairesActifs: true,
  totalLots: 41,
  clotureLabel: 'ferme dans 3 j',
  ouvertDepuisLabel: 'Ouvert 3 j',
  status: 'actif',
  monVote: null,
  comments: [
    {
      id: '1',
      author: 'Karim B.',
      role: 'voisin',
      initials: 'KB',
      text: 'Bonne idee, je peux amener des palettes pour le construire.',
    },
    {
      id: '2',
      author: 'Michel Durand',
      role: 'gardien',
      initials: 'MD',
      text: "Je peux m'occuper du suivi si ca passe, j'ai deja de l'experience avec un compost.",
    },
  ],
};

export const MOCK_SONDAGES_PASSES: Sondage[] = [
  {
    id: 'horaires-travaux',
    auteur: { nom: 'Emma M.', initials: 'EM', etage: '3ème' },
    question: 'Quels horaires pour les travaux bruyants ?',
    contexte: '',
    options: [
      { id: '9-18', label: '9h - 18h en semaine', votes: 22 },
      { id: '9-12-14-18', label: '9h-12h / 14h-18h', votes: 12 },
      { id: 'sans-avis', label: 'Sans avis', votes: 2 },
    ],
    dureeJours: 7,
    portee: 'immeuble',
    anonyme: false,
    commentairesActifs: false,
    totalLots: 41,
    clotureLabel: 'Clos',
    ouvertDepuisLabel: 'Clos le 2 mars',
    status: 'clos',
    monVote: '9-18',
    comments: [],
    winningOptionId: '9-18',
  },
  {
    id: 'boite-a-livres',
    auteur: { nom: 'Karim B.', initials: 'KB', etage: '5ème' },
    question: 'Une boîte à livres dans le hall ?',
    contexte: '',
    options: [
      { id: 'oui', label: 'Oui, bonne idée', votes: 19 },
      { id: 'non', label: 'Non, pas de place', votes: 4 },
    ],
    dureeJours: 7,
    portee: 'immeuble',
    anonyme: false,
    commentairesActifs: false,
    totalLots: 41,
    clotureLabel: 'Clos',
    ouvertDepuisLabel: 'Clos le 22 fev.',
    status: 'clos',
    monVote: 'oui',
    comments: [],
    winningOptionId: 'oui',
  },
];
