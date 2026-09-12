import { create } from 'zustand';
import { useAuthStore } from './authStore';

export type ResidentRole = 'locataire' | 'coproprietaire';

export const ROLE_LABELS: Record<ResidentRole, string> = {
  locataire: 'Locataire',
  coproprietaire: 'Copropriétaire',
};

/**
 * Le role brut vient de authStore (session Supabase / user_metadata.role,
 * ou DEMO_USER en dev sans backend). C'est la source de verite unique ;
 * ce store derive uniquement le libelle "resident" utilise par l'UI.
 */
export function mapAuthRoleToResident(authRole: string | undefined): ResidentRole {
  return authRole === 'resident' ? 'coproprietaire' : 'locataire';
}

function residentToAuthRole(role: ResidentRole): string {
  return role === 'coproprietaire' ? 'resident' : 'tenant';
}

interface RoleState {
  role: ResidentRole;
  setRole: (role: ResidentRole) => void;
  toggleRole: () => void;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  role: mapAuthRoleToResident(useAuthStore.getState().user?.role),
  setRole: (role) => {
    set({ role });
    // Repercute sur authStore pour que le role reste coherent partout
    // (utile pour le toggle de demo dans Profil, tant que le backend n'est pas branche).
    useAuthStore.setState((s) =>
      s.user ? { user: { ...s.user, role: residentToAuthRole(role) } } : s,
    );
  },
  toggleRole: () => {
    get().setRole(get().role === 'locataire' ? 'coproprietaire' : 'locataire');
  },
}));

// Garde roleStore synchronise si authStore.user.role change ailleurs
// (login, refresh de session Supabase, onAuthStateChange...).
useAuthStore.subscribe((state, prevState) => {
  if (state.user?.role !== prevState.user?.role) {
    useRoleStore.setState({ role: mapAuthRoleToResident(state.user?.role) });
  }
});
