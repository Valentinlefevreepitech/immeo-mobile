import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { Sentry } from '@/lib/sentry';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  initials: string;
  role: string;
  firstName: string;
  lastName: string;
  coproprieteId: string | null;
  apartmentId: string | null;
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

const ALLOWED_ROLES = ['resident', 'tenant'];

// Session fictive quand aucun backend n'est configuré (dev uniquement) :
// permet de naviguer dans l'app alimentée par les fixtures.
const DEMO_USER: UserProfile = {
  id: 'demo',
  email: 'valentin.lefevre@epitech.digital',
  fullName: 'Valentin Lefevre',
  initials: 'VL',
  role: 'tenant',
  firstName: 'Valentin',
  lastName: 'Lefevre',
  coproprieteId: 'demo-copro',
  apartmentId: null,
};

function buildProfileFromAuth(authUser: User): UserProfile {
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
    role: meta.role || 'resident',
    firstName,
    lastName,
    coproprieteId: meta.copropriete_id || null,
    apartmentId: meta.apartment_id || null,
  };
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
        const role = session.user.user_metadata?.role;
        if (role && ALLOWED_ROLES.includes(role)) {
          set({ user: buildProfileFromAuth(session.user) });
        }
      }
    });

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const role = session.user.user_metadata?.role;
        if (role && ALLOWED_ROLES.includes(role)) {
          set({
            user: buildProfileFromAuth(session.user),
            isLoggedIn: true,
            isInitialized: true,
          });
          return;
        }
        // Role non autorise → deconnexion
        await supabase.auth.signOut();
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

    const role = data.user.user_metadata?.role;

    if (!role || !ALLOWED_ROLES.includes(role)) {
      await supabase.auth.signOut();
      set({ isLoading: false });
      return {
        success: false,
        error:
          'Cette application est reservee aux residents. Utilisez le portail web pour la gestion.',
      };
    }

    set({
      user: buildProfileFromAuth(data.user),
      isLoggedIn: true,
      isLoading: false,
    });
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
      set({
        user: buildProfileFromAuth(data.user),
        isLoggedIn: true,
        isLoading: false,
      });
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
    // Pas d'appel reseau ici : aucun projet Supabase connecte dans cet
    // environnement. Le vrai rattachement (RPC/Edge Function) arrivera
    // avec la Phase 8.
    set((state) => (state.user ? { user: { ...state.user, coproprieteId } } : state));
  },
}));
