import { create } from 'zustand';

interface ConsentsState {
  annuaireVisible: boolean;
  setAnnuaireVisible: (value: boolean) => void;
}

/**
 * Consentement "Annuaire des voisins" (Profil), partage entre l'ecran
 * Profil (toggle) et l'annuaire (bandeau si l'utilisateur n'est pas visible).
 */
export const useConsentsStore = create<ConsentsState>((set) => ({
  annuaireVisible: false,
  setAnnuaireVisible: (value) => set({ annuaireVisible: value }),
}));
