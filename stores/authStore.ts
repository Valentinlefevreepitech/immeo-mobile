import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { Sentry } from '@/lib/sentry';
import { supabase } from '@/lib/supabase';

export type ResolvedRole = 'gestionnaire' | 'coproprietaire' | 'locataire' | null;

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  initials: string;
  role: ResolvedRole;
  firstName: string;
  lastName: string;
  coproprieteId: string | null;
  apartmentId: string | null;
  cabinetId?: string | null;
  coproprietaireId?: string | null;
  tenantId?: string | null;
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setCopropriete: (coproprieteId: string) => void;
}

// Session fictive quand aucun backend n'est configuré (dev uniquement) :
// permet de naviguer dans l'app alimentée par les fixtures.
const DEMO_USER: UserProfile = {
  id: 'demo',
  email: 'valentin.lefevre@epitech.digital',
  fullName: 'Valentin Lefevre',
  initials: 'VL',
  role: 'locataire',
  firstName: 'Valentin',
  lastName: 'Lefevre',
  coproprieteId: 'demo-copro',
  apartmentId: null,
};

function buildBaseProfile(authUser: User): Omit<UserProfile, 'role'> {
  const meta = authUser.user_metadata || {};
  const firstName = meta.first_name || '';
  const lastName = meta.last_name || '';
  const fullName =
    [firstName, lastName].filter(Boolean).join(' ') || authUser.email?.split('@')[0] || '';
  const initials = fullName
    .split(' ')
    .map((s: string) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return {
    id: authUser.id,
    email: authUser.email || '',
    fullName,
    initials,
    firstName,
    lastName,
    coproprieteId: null,
    apartmentId: null,
  };
}

/**
 * Determine le role reel du resident en interrogeant les tables de
 * rattachement (cabinet_members > coproprietaires > tenants), plutot que de
 * se fier a user_metadata.role (jamais assigne de facon fiable cote serveur).
 */
async function resolveResidentRole(authUser: User): Promise<UserProfile> {
  const base = buildBaseProfile(authUser);
  if (!supabase) return { ...base, role: null };

  const { data: cabinetMember } = await supabase
    .from('cabinet_members')
    .select('cabinet_id')
    .eq('user_id', authUser.id)
    .maybeSingle();

  if (cabinetMember) {
    return { ...base, role: 'gestionnaire', cabinetId: cabinetMember.cabinet_id };
  }

  const { data: coproprietaire } = await supabase
    .from('coproprietaires')
    .select('id, copropriete_id')
    .eq('auth_user_id', authUser.id)
    .maybeSingle();

  if (coproprietaire) {
    return {
      ...base,
      role: 'coproprietaire',
      coproprietaireId: coproprietaire.id,
      coproprieteId: coproprietaire.copropriete_id,
    };
  }

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, apartment_id, apartments(copropriete_id)')
    .eq('auth_user_id', authUser.id)
    .maybeSingle();

  if (tenant) {
    return {
      ...base,
      role: 'locataire',
      tenantId: tenant.id,
      apartmentId: tenant.apartment_id,
      coproprieteId:
        (tenant as { apartments?: { copropriete_id: string } | null }).apartments?.copropriete_id ??
        null,
    };
  }

  return { ...base, role: null };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isLoggedIn: false,
  isInitialized: false,

  initialize: async () => {
    if (!supabase) {
      if (__DEV__) {
        set({ user: DEMO_USER, isLoggedIn: true, isInitialized: true });
        return;
      }
      set({ isInitialized: true });
      return;
    }

    // Ecouter les changements d'etat d'authentification
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        set({ user: null, isLoggedIn: false, isLoading: false });
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        resolveResidentRole(session.user).then((user) => set({ user }));
      }
    });

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const user = await resolveResidentRole(session.user);
        set({ user, isLoggedIn: true, isInitialized: true });
        return;
      }
    } catch (error) {
      Sentry.captureException(error);
      if (__DEV__) {
        console.warn('[AuthStore] Erreur initialisation:', error);
      }
    }

    set({ isInitialized: true });
  },

  login: async (email, password) => {
    if (!supabase) {
      return { success: false, error: 'Service indisponible' };
    }

    set({ isLoading: true });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      set({ isLoading: false });
      return { success: false, error: 'Email ou mot de passe incorrect' };
    }

    const user = await resolveResidentRole(data.user);
    set({ user, isLoggedIn: true, isLoading: false });
    return { success: true };
  },

  register: async (fullName, email, password) => {
    if (!supabase) {
      return { success: false, error: 'Service indisponible' };
    }

    set({ isLoading: true });

    const [firstName, ...lastParts] = fullName.trim().split(' ');
    const lastName = lastParts.join(' ');

    // Note: le role ne doit PAS etre assigne cote client.
    // Il doit etre defini par un trigger SQL ou une Edge Function Supabase
    // (ex: handle_new_user → INSERT INTO profiles avec role par defaut).
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      set({ isLoading: false });
      if (error.message.includes('already registered')) {
        return { success: false, error: 'Un compte existe deja avec cet email' };
      }
      return { success: false, error: error.message };
    }

    if (data.user && !data.session) {
      set({ isLoading: false });
      return {
        success: false,
        error: 'Un email de confirmation vous a ete envoye. Verifiez votre boite mail.',
      };
    }

    if (data.user && data.session) {
      // Tente de rattacher automatiquement le compte a une ligne
      // tenants/coproprietaires existante partageant le meme email.
      await supabase.rpc('claim_resident_by_email', { p_email: email });
      const user = await resolveResidentRole(data.user);
      set({ user, isLoggedIn: true, isLoading: false });
    }

    return { success: true };
  },

  logout: async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    set({ user: null, isLoggedIn: false, isLoading: false });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setCopropriete: (coproprieteId) => {
    // Flow "creer une nouvelle copropriete" encore mock/local (pas de
    // cabinet de gestion associe pour l'instant, voir plan Phase 8 Step 1).
    // On pose role: 'coproprietaire' pour que useAuthGuard laisse passer
    // vers l'app une fois la creation "confirmee".
    set((state) =>
      state.user ? { user: { ...state.user, coproprieteId, role: 'coproprietaire' } } : state,
    );
  },
}));
