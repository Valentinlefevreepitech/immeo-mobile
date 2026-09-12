export interface Voisin {
  id: string;
  nom: string;
  initials: string;
  etage: string;
  role?: 'gardien';
}

// Casting reutilise dans le reste de l'app (sondages, entraide) pour la
// coherence entre ecrans.
export const MOCK_VOISINS: Voisin[] = [
  { id: 'michel', nom: 'Michel Durand', initials: 'MD', etage: 'Loge RDC', role: 'gardien' },
  { id: 'julien', nom: 'Julien P.', initials: 'JP', etage: '1er étage' },
  { id: 'nadia', nom: 'Nadia B.', initials: 'NB', etage: '2ème étage' },
  { id: 'sophie', nom: 'Sophie M.', initials: 'SM', etage: '3ème étage' },
  { id: 'emma', nom: 'Emma M.', initials: 'EM', etage: '3ème étage' },
  { id: 'camille', nom: 'Camille R.', initials: 'CR', etage: '4ème étage' },
  { id: 'karim', nom: 'Karim B.', initials: 'KB', etage: '5ème étage' },
];
