import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIncidents } from '@/hooks/useIncidents';

jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

jest.mock('@/lib/supabase', () => ({ supabase: null }));
jest.mock('@/stores/authStore', () => ({
  useAuthStore: (selector: (s: { user: null }) => unknown) => selector({ user: null }),
}));

jest.mock('@/fixtures/incidents', () => ({
  MOCK_INCIDENTS: [
    { id: '1', title: 'Fuite robinet', category: 'Plomberie', date: '12 mars', status: 'En cours' },
    { id: '2', title: 'Prise HS', category: 'Electricite', date: '5 mars', status: 'En attente' },
  ],
  MOCK_TRAVAUX: [
    { id: '1', title: 'Ravalement facade', entreprise: 'Batipro', status: 'en_cours' },
  ],
  MOCK_SYNDIC: { name: 'Cabinet Foncia', phone: '0123456789', email: 'contact@foncia.fr' },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useIncidents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns initial incidents list from fixtures', () => {
    const { result } = renderHook(() => useIncidents(), { wrapper: createWrapper() });

    expect(result.current.incidents).toHaveLength(2);
    expect(result.current.incidents[0].title).toBe('Fuite robinet');
    expect(result.current.incidents[1].title).toBe('Prise HS');
  });

  it('returns travaux and syndic data', () => {
    const { result } = renderHook(() => useIncidents(), { wrapper: createWrapper() });

    expect(result.current.travaux).toHaveLength(1);
    expect(result.current.travaux[0].title).toBe('Ravalement facade');
    expect(result.current.syndic.name).toBe('Cabinet Foncia');
  });

  it('starts with modal closed', () => {
    const { result } = renderHook(() => useIncidents(), { wrapper: createWrapper() });

    expect(result.current.showModal).toBe(false);
  });

  it('opens and closes modal', () => {
    const { result } = renderHook(() => useIncidents(), { wrapper: createWrapper() });

    act(() => {
      result.current.openModal();
    });
    expect(result.current.showModal).toBe(true);

    act(() => {
      result.current.closeModal();
    });
    expect(result.current.showModal).toBe(false);
  });

  it('creates a new incident and shows alert', () => {
    const { result } = renderHook(() => useIncidents(), { wrapper: createWrapper() });

    act(() => {
      result.current.createIncident({
        title: 'Nouveau probleme',
        category: 'Plomberie',
        description: 'Description du probleme',
      });
    });

    // Modal should close
    expect(result.current.showModal).toBe(false);

    // Alert should be shown
    expect(Alert.alert).toHaveBeenCalledWith(
      'Signalement envoye !',
      'Votre signalement "Nouveau probleme" a ete transmis au syndic.',
    );
  });

  it('closes modal after creating an incident', () => {
    const { result } = renderHook(() => useIncidents(), { wrapper: createWrapper() });

    act(() => {
      result.current.openModal();
    });
    expect(result.current.showModal).toBe(true);

    act(() => {
      result.current.createIncident({
        title: 'Test',
        category: 'Autre',
        description: 'Test desc',
      });
    });
    expect(result.current.showModal).toBe(false);
  });

  it('shows alert after creating an incident', () => {
    const { result } = renderHook(() => useIncidents(), { wrapper: createWrapper() });

    act(() => {
      result.current.createIncident({
        title: 'Fuite eau',
        category: 'Plomberie',
        description: 'Une fuite',
      });
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Signalement envoye !',
      'Votre signalement "Fuite eau" a ete transmis au syndic.',
    );
  });

  it('exposes loading and error states', () => {
    const { result } = renderHook(() => useIncidents(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeFalsy();
  });
});
