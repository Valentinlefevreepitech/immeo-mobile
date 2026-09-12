import { create } from 'zustand';
import { useAuthStore, type ResolvedRole } from './authStore';

export type ResidentRole = 'locataire' | 'coproprietaire' | 'gestionnaire';

export const ROLE_LABELS: Record<ResidentRole, string> = {
  locataire: 'Locataire',
  coproprietaire: 'Copropriétaire',
  gestionnaire: 'Gestionnaire',
};

/**
 * Le role brut vient de authStore, resolu depuis les vraies tables Supabase
 * (cabinet_members / coproprietaires / tenants) ou DEMO_USER en dev sans
 * backend. C'est la source de verite unique ; ce store derive uniquement le
 * libelle "resident" utilise par l'UI. `null` (pas encore rattache) retombe
 * sur "locataire" par defaut le temps que l'ecran de rattachement s'affiche.
 */
export function mapAuthRoleToResident(authRole: ResolvedRole | undefined): ResidentRole {
  return authRole ?? 'locataire';
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
    // Repercute sur authStore uniquement en mode demo (pas de backend
    // connecte) : sinon le role est resolu depuis les vraies tables et ne
    // doit pas etre modifiable manuellement.
    if (!useAuthStore.getState().user || useAuthStore.getState().user?.id === 'demo') {
      useAuthStore.setState((s) => (s.user ? { user: { ...s.user, role } } : s));
    }
  },
  toggleRole: () => {
    const order: ResidentRole[] = ['locataire', 'coproprietaire', 'gestionnaire'];
    const next = order[(order.indexOf(get().role) + 1) % order.length];
    get().setRole(next);
  },
}));

// Garde roleStore synchronise si authStore.user.role change ailleurs
// (login, refresh de session Supabase, onAuthStateChange...).
useAuthStore.subscribe((state, prevState) => {
  if (state.user?.role !== prevState.user?.role) {
    useRoleStore.setState({ role: mapAuthRoleToResident(state.user?.role) });
  }
});
