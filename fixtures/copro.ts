export const MOCK_CONVERSATIONS = [
  {
    id: '1',
    name: 'Groupe Residents',
    initials: 'GR',
    message: "Est-ce que quelqu'un a le numero du plombier ?",
    time: '14:32',
    unread: true,
    detail:
      'La messagerie sera bientot disponible.\n\nDernier message :\n"Est-ce que quelqu\'un a le numero du plombier ?"',
  },
  {
    id: '2',
    name: 'Voisins 3eme etage',
    initials: 'V3',
    message: "Merci pour l'info sur les poubelles !",
    time: 'Hier',
    unread: false,
    detail:
      'La messagerie sera bientot disponible.\n\nDernier message :\n"Merci pour l\'info sur les poubelles !"',
  },
  {
    id: '3',
    name: 'Sophie M.',
    initials: 'SM',
    message: "D'accord, je te prete le diable demain",
    time: 'Lun.',
    unread: false,
    detail:
      'La messagerie sera bientot disponible.\n\nDernier message :\n"D\'accord, je te prete le diable demain"',
  },
];

export const MOCK_ANNONCES = [
  {
    id: '1',
    title: 'Mise a jour du reglement interieur',
    content:
      'Le nouveau reglement interieur est disponible. Merci de le consulter dans la section Documents de votre espace.',
    date: '10 mars 2026',
    author: 'Cabinet Foncia',
    detail:
      'Le nouveau reglement interieur est disponible. Merci de le consulter dans la section Documents de votre espace.\n\nPublie par Cabinet Foncia le 10 mars 2026.',
  },
  {
    id: '2',
    title: 'Collecte des encombrants',
    content:
      'Une collecte des encombrants est prevue le samedi 21 mars. Deposez vos objets dans le local poubelles la veille au soir.',
    date: '8 mars 2026',
    author: 'Michel Durand (Gardien)',
    detail:
      'Une collecte des encombrants est prevue le samedi 21 mars.\n\nDeposez vos objets dans le local poubelles la veille au soir (vendredi 20 mars apres 19h).\n\nPublie par Michel Durand le 8 mars 2026.',
  },
];

// ─────────────────────────────────────────────────────────────
// Prototype v2 : panneau d'affichage, fil d'actualité, messagerie syndic
// ─────────────────────────────────────────────────────────────

export const MOCK_PANNEAU = [
  {
    id: 'reglement',
    badge: 'SYNDIC',
    badgeVariant: 'teal' as const,
    date: '10 mars',
    title: 'Mise à jour du règlement intérieur',
    content: 'Le nouveau règlement est disponible dans la section Documents de votre espace.',
  },
  {
    id: 'encombrants',
    badge: 'GARDIEN',
    badgeVariant: 'blue' as const,
    date: '8 mars',
    title: 'Collecte des encombrants',
    content: 'Samedi 21 mars. Déposez vos objets dans le local poubelles la veille au soir.',
  },
];

export const MOCK_FIL_ACTUALITE = [
  {
    id: 'ravalement',
    color: 'info' as const,
    title: 'Ravalement façade — 40%',
    subtitle: "Échafaudage côté rue jusqu'à fin avril",
  },
  {
    id: 'fete-voisins',
    color: 'primary' as const,
    title: 'Fête des voisins le 5 juin',
    subtitle: 'Inscriptions ouvertes dans le hall',
  },
];

// Pas de chat P2P résident dans le P0 — uniquement syndic + gardien.
export const MOCK_CONVERSATIONS_V2 = [
  {
    id: 'foncia',
    name: 'Cabinet Foncia',
    initials: 'CF',
    gradient: true,
    message: 'Le plombier passera mercredi entre 9h et 12h',
    time: '14:32',
    unread: 1,
  },
  {
    id: 'gardien',
    name: 'Michel Durand · Gardien',
    initials: 'MD',
    gradient: false,
    message: 'Colis récupéré à la loge 👍',
    time: 'Hier',
    unread: 0,
  },
];

export const MOCK_SONDAGE = {
  question: 'Installation de bornes de recharge ?',
  options: [
    { label: 'Pour', votes: 18 },
    { label: 'Contre', votes: 5 },
    { label: 'Neutre', votes: 3 },
  ],
  totalVotes: 26,
  endsAt: '25 mars 2026',
};
