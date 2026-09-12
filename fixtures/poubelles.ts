export type PoubelleCouleur = 'muted' | 'warning' | 'success' | 'secondary';

export interface Poubelle {
  id: string;
  type: string;
  joursLabel: string;
  consigne: string;
  couleur: PoubelleCouleur;
}

export const MOCK_POUBELLES: Poubelle[] = [
  {
    id: 'menageres',
    type: 'Ordures ménagères',
    joursLabel: 'Lun · Jeu',
    consigne: 'Sortir la veille après 19h',
    couleur: 'muted',
  },
  {
    id: 'tri',
    type: 'Tri sélectif',
    joursLabel: 'Mer',
    consigne: 'Emballages, papier, carton',
    couleur: 'warning',
  },
  {
    id: 'verre',
    type: 'Verre',
    joursLabel: 'Apport volontaire',
    consigne: 'Colonne cour arrière',
    couleur: 'success',
  },
  {
    id: 'encombrants',
    type: 'Encombrants',
    joursLabel: '1er samedi du mois',
    consigne: 'Sur inscription auprès du gardien',
    couleur: 'secondary',
  },
];
