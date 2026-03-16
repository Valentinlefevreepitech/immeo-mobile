/**
 * Tests pour le store d'authentification (authStore).
 * On mock supabase pour tester la logique du store en isolation.
 */

import { useAuthStore } from '../stores/authStore';

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

    it('connecte un utilisateur avec un role autorise', async () => {
      mockAuth.getSession.mockResolvedValueOnce({
        data: {
          session: {
            user: {
              id: '123',
              email: 'test@test.com',
              user_metadata: {
                first_name: 'Jean',
                last_name: 'Dupont',
                role: 'resident',
              },
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
      expect(state.user?.email).toBe('test@test.com');
    });

    it('deconnecte un utilisateur avec un role non autorise', async () => {
      mockAuth.getSession.mockResolvedValueOnce({
        data: {
          session: {
            user: {
              id: '123',
              email: 'admin@test.com',
              user_metadata: { role: 'admin' },
            },
          },
        },
      });

      await useAuthStore.getState().initialize();

      expect(mockAuth.signOut).toHaveBeenCalled();
      expect(useAuthStore.getState().isLoggedIn).toBe(false);
    });

    it('enregistre le listener onAuthStateChange', async () => {
      mockAuth.getSession.mockResolvedValueOnce({ data: { session: null } });

      await useAuthStore.getState().initialize();

      expect(mockAuth.onAuthStateChange).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('connecte avec des identifiants valides', async () => {
      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: {
            id: '123',
            email: 'test@test.com',
            user_metadata: {
              first_name: 'Marie',
              last_name: 'Martin',
              role: 'resident',
            },
          },
        },
        error: null,
      });

      const result = await useAuthStore.getState().login('test@test.com', 'password');

      expect(result.success).toBe(true);
      expect(useAuthStore.getState().isLoggedIn).toBe(true);
      expect(useAuthStore.getState().user?.fullName).toBe('Marie Martin');
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

    it('refuse un role non autorise apres login', async () => {
      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: {
            id: '123',
            email: 'admin@test.com',
            user_metadata: { role: 'admin' },
          },
        },
        error: null,
      });

      const result = await useAuthStore.getState().login('admin@test.com', 'password');

      expect(result.success).toBe(false);
      expect(result.error).toContain('reservee aux residents');
      expect(mockAuth.signOut).toHaveBeenCalled();
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
        data: {
          user: {
            id: '1',
            email: 'test@test.com',
            user_metadata: { role: 'resident' },
          },
        },
        error: null,
      });

      await loginCall;
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('register', () => {
    it('inscrit un nouvel utilisateur', async () => {
      mockAuth.signUp.mockResolvedValueOnce({
        data: {
          user: {
            id: '456',
            email: 'new@test.com',
            user_metadata: {
              first_name: 'Pierre',
              last_name: 'Durand',
            },
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
          role: 'resident',
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
