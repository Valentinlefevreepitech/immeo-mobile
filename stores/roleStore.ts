import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ResidentRole = 'locataire' | 'coproprietaire';

interface RoleState {
  /**
   * Role du resident dans la copropriete.
   * Vient du back-office a l'activation du compte (invitation).
   * Conditionne l'ecran Appart (loyer vs solde / appels de fonds),
   * les libelles des documents et l'acces au vote AG.
   */
  role: ResidentRole;
  setRole: (role: ResidentRole) => void;
  toggleRole: () => void;
}

export const ROLE_LABELS: Record<ResidentRole, string> = {
  locataire: 'Locataire',
  coproprietaire: 'Copropriétaire',
};

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      role: 'locataire',
      setRole: (role) => set({ role }),
      toggleRole: () =>
        set((s) => ({ role: s.role === 'locataire' ? 'coproprietaire' : 'locataire' })),
    }),
    {
      name: 'immeo-role',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
