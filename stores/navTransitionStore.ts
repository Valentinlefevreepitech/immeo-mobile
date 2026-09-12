import { create } from 'zustand';

export type NavDirection = 'left' | 'right';

interface NavTransitionState {
  direction: NavDirection;
  setDirection: (direction: NavDirection) => void;
}

/**
 * Direction du prochain slide entre onglets (Accueil/Copro/Profil), poussee
 * par `CustomTabBar` avant navigation et lue par `TabSlideTransition` dans
 * l'ecran cible. Ne concerne que les 4 onglets principaux (Appart utilise
 * sa propre transition "porte", voir `DoorTransition`).
 */
export const useNavTransitionStore = create<NavTransitionState>((set) => ({
  direction: 'right',
  setDirection: (direction) => set({ direction }),
}));
