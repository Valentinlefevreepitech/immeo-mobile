import { renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useProfile } from '@/hooks/useProfile';
import { useAuthStore } from '@/stores/authStore';

jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

const mockLogout = jest.fn();
const mockUser = {
  id: '1',
  email: 'test@test.com',
  fullName: 'Jean Dupont',
  initials: 'JD',
  role: 'resident',
  firstName: 'Jean',
  lastName: 'Dupont',
};

jest.mock('@/stores/authStore', () => ({
  useAuthStore: jest.fn(() => ({
    user: mockUser,
    logout: mockLogout,
  })),
}));

jest.mock('@/constants/colors', () => ({
  colors: {
    primary: { 500: '#0A7968' },
    success: '#22C55E',
  },
}));

// Mock supabase as null (no backend in tests)
jest.mock('@/lib/supabase', () => ({
  supabase: null,
}));

// Mock React Query hooks
const mockQueryClient = {
  invalidateQueries: jest.fn(),
};

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
  useMutation: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  useQueryClient: jest.fn(() => mockQueryClient),
}));

describe('useProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
  });

  it('returns profile data from auth store user when no owner data', () => {
    const { result } = renderHook(() => useProfile());

    expect(result.current.profile.fullName).toBe('Jean Dupont');
    expect(result.current.profile.initials).toBe('JD');
    expect(result.current.profile.email).toBe('test@test.com');
  });

  it('returns fallback profile when user is null', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
      logout: mockLogout,
    });

    const { result } = renderHook(() => useProfile());

    expect(result.current.profile.initials).toBe('VL');
    expect(result.current.profile.fullName).toBe('Valentin Lefevre');
    expect(result.current.profile.email).toBe('valentin.lefevre@epitech.digital');
  });

  it('returns stats array with three items (placeholder values without backend)', () => {
    const { result } = renderHook(() => useProfile());

    expect(result.current.stats).toHaveLength(3);
    expect(result.current.stats[0]).toEqual({ value: '--', label: 'Appartement' });
    expect(result.current.stats[1]).toEqual({ value: '--', label: 'Etage' });
    expect(result.current.stats[2]).toMatchObject({ value: '--', label: 'Anciennete' });
  });

  it('handleLogout shows confirmation alert', () => {
    const { result } = renderHook(() => useProfile());

    result.current.handleLogout();

    expect(Alert.alert).toHaveBeenCalledWith(
      'Se deconnecter',
      'Etes-vous sur de vouloir vous deconnecter ?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Annuler', style: 'cancel' }),
        expect.objectContaining({ text: 'Deconnecter', style: 'destructive' }),
      ]),
    );
  });

  it('handleLogout calls logout when confirmed', () => {
    const { result } = renderHook(() => useProfile());

    result.current.handleLogout();

    // Get the destructive button config and call its onPress
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const buttons = alertCall[2];
    const disconnectButton = buttons.find((b: { text: string }) => b.text === 'Deconnecter');
    disconnectButton.onPress();

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('exposes updateProfile and loading states', () => {
    const { result } = renderHook(() => useProfile());

    expect(result.current.updateProfile).toBeDefined();
    expect(result.current.isUpdatingProfile).toBe(false);
    expect(result.current.isLoadingOwner).toBe(false);
    expect(result.current.isLoadingStats).toBe(false);
  });
});
