/**
 * Tests pour le store d'authentification (authStore).
 * On mock supabase pour tester la logique du store en isolation.
 */

import { useAuthStore } from '../stores/authStore';

function mockFromChain(config: {
  cabinet_members?: unknown;
  coproprietaires?: unknown;
  tenants?: unknown;
}) {
  return jest.fn((table: string) => {
    const data =
      table === 'cabinet_members'
        ? (config.cabinet_members ?? null)
        : table === 'coproprietaires'
          ? (config.coproprietaires ?? null)
          : table === 'tenants'
            ? (config.tenants ?? null)
            : null;
    return {
      select: jest.fn(() => ({
        eq: jest.fn(() => ({ maybeSingle: jest.fn().mockResolvedValue({ data }) })),
      })),
    };
  });
}

jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({ maybeSingle: jest.fn().mockResolvedValue({ data: null }) })),
      })),
    })),
    rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { supabase } = require('../lib/supabase');
const mockAuth = supabase.auth;

function resetStore() {
  useAuthStore.setState({
    user: null,
    isLoading: false,
    isLoggedIn: false,
    isInitialized: false,
  });
}

beforeEach(() => {
  resetStore();
  jest.clearAllMocks();
  supabase.from.mockImplementation(mockFromChain({}));
  supabase.rpc.mockResolvedValue({ data: null, error: null });
});

describe('authStore', () => {
  describe('etat initial', () => {
    it('demarre avec user null et non connecte', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isLoggedIn).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.isInitialized).toBe(false);
    });
  });

  describe('initialize', () => {
    it('marque isInitialized si pas de session', async () => {
      mockAuth.getSession.mockResolvedValueOnce({ data: { session: null } });

      await useAuthStore.getState().initialize();

      expect(useAuthStore.getState().isInitialized).toBe(true);
      expect(useAuthStore.getState().isLoggedIn).toBe(false);
    });

    it('connecte un utilisateur et resout son role via coproprietaires', async () => {
      supabase.from.mockImplementation(
        mockFromChain({ coproprietaires: { id: 'copro-1', copropriete_id: 'building-1' } }),
      );
      mockAuth.getSession.mockResolvedValueOnce({
        data: {
          session: {
            user: {
              id: '123',
              email: 'test@test.com',
              user_metadata: { first_name: 'Jean', last_name: 'Dupont' },
            },
          },
        },
      });

      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.isLoggedIn).toBe(true);
      expect(state.isInitialized).toBe(true);
      expect(state.user?.fullName).toBe('Jean Dupont');
      expect(state.user?.initials).toBe('JD');
      expect(state.user?.role).toBe('coproprietaire');
      expect(state.user?.coproprieteId).toBe('building-1');
    });

    it('connecte un utilisateur avec role null si aucun rattachement trouve', async () => {
      mockAuth.getSession.mockResolvedValueOnce({
        data: {
          session: {
            user: { id: '123', email: 'nomatch@test.com', user_metadata: {} },
          },
        },
      });

      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.isLoggedIn).toBe(true);
      expect(state.user?.role).toBeNull();
    });

    it('enregistre le listener onAuthStateChange', async () => {
      mockAuth.getSession.mockResolvedValueOnce({ data: { session: null } });

      await useAuthStore.getState().initialize();

      expect(mockAuth.onAuthStateChange).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('connecte avec des identifiants valides et resout le role gestionnaire', async () => {
      supabase.from.mockImplementation(
        mockFromChain({ cabinet_members: { cabinet_id: 'cabinet-1' } }),
      );
      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: {
            id: '123',
            email: 'test@test.com',
            user_metadata: { first_name: 'Marie', last_name: 'Martin' },
          },
        },
        error: null,
      });

      const result = await useAuthStore.getState().login('test@test.com', 'password');

      expect(result.success).toBe(true);
      expect(useAuthStore.getState().isLoggedIn).toBe(true);
      expect(useAuthStore.getState().user?.fullName).toBe('Marie Martin');
      expect(useAuthStore.getState().user?.role).toBe('gestionnaire');
      expect(useAuthStore.getState().user?.cabinetId).toBe('cabinet-1');
    });

    it('retourne une erreur si identifiants incorrects', async () => {
      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid login credentials' },
      });

      const result = await useAuthStore.getState().login('wrong@test.com', 'wrong');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email ou mot de passe incorrect');
      expect(useAuthStore.getState().isLoggedIn).toBe(false);
    });

    it('gere isLoading pendant le login', async () => {
      let resolveLogin: (value: unknown) => void;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });
      mockAuth.signInWithPassword.mockReturnValueOnce(loginPromise);

      const loginCall = useAuthStore.getState().login('test@test.com', 'pass');
      expect(useAuthStore.getState().isLoading).toBe(true);

      resolveLogin!({
        data: { user: { id: '1', email: 'test@test.com', user_metadata: {} } },
        error: null,
      });

      await loginCall;
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('register', () => {
    it('inscrit un nouvel utilisateur et tente le rattachement automatique par email', async () => {
      mockAuth.signUp.mockResolvedValueOnce({
        data: {
          user: {
            id: '456',
            email: 'new@test.com',
            user_metadata: { first_name: 'Pierre', last_name: 'Durand' },
          },
          session: { access_token: 'token' },
        },
        error: null,
      });

      const result = await useAuthStore
        .getState()
        .register('Pierre Durand', 'new@test.com', 'Password1!');

      expect(result.success).toBe(true);
      expect(useAuthStore.getState().isLoggedIn).toBe(true);
      expect(useAuthStore.getState().user?.fullName).toBe('Pierre Durand');
      expect(supabase.rpc).toHaveBeenCalledWith('claim_resident_by_email', {
        p_email: 'new@test.com',
      });
    });

    it('retourne un message si confirmation email requise', async () => {
      mockAuth.signUp.mockResolvedValueOnce({
        data: {
          user: { id: '456', email: 'new@test.com', user_metadata: {} },
          session: null,
        },
        error: null,
      });

      const result = await useAuthStore
        .getState()
        .register('Test User', 'new@test.com', 'Password1!');

      expect(result.success).toBe(false);
      expect(result.error).toContain('email de confirmation');
      expect(useAuthStore.getState().isLoggedIn).toBe(false);
    });

    it('retourne une erreur si email deja utilise', async () => {
      mockAuth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'User already registered' },
      });

      const result = await useAuthStore
        .getState()
        .register('Test', 'existing@test.com', 'Password1!');

      expect(result.success).toBe(false);
      expect(result.error).toContain('existe deja');
    });

    it('ne passe PAS de role dans les metadata', async () => {
      mockAuth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: null,
      });

      await useAuthStore.getState().register('Test User', 'test@test.com', 'Password1!');

      const signUpCall = mockAuth.signUp.mock.calls[0][0];
      expect(signUpCall.options.data).not.toHaveProperty('role');
    });
  });

  describe('logout', () => {
    it('reinitialise le state apres logout', async () => {
      useAuthStore.setState({
        user: {
          id: '1',
          email: 'test@test.com',
          fullName: 'Test',
          initials: 'T',
          role: 'locataire',
          firstName: 'Test',
          lastName: '',
          coproprieteId: null,
          apartmentId: null,
        },
        isLoggedIn: true,
      });

      await useAuthStore.getState().logout();

      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isLoggedIn).toBe(false);
      expect(mockAuth.signOut).toHaveBeenCalled();
    });
  });
});
