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
