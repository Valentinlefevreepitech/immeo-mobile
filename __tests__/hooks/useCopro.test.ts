import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCopro } from '@/hooks/useCopro';

jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

jest.mock('@/lib/supabase', () => ({ supabase: null }));
jest.mock('@/stores/authStore', () => ({
  useAuthStore: (selector: (s: { user: null }) => unknown) => selector({ user: null }),
}));

jest.mock('@/fixtures/copro', () => ({
  MOCK_CONVERSATIONS: [
    {
      id: '1',
      name: 'Groupe Residents',
      initials: 'GR',
      message: 'Test msg',
      time: '14:32',
      unread: true,
    },
  ],
  MOCK_ANNONCES: [
    { id: '1', title: 'Annonce test', content: 'Contenu', date: '10 mars', author: 'Foncia' },
  ],
  MOCK_SONDAGE: {
    question: 'Installation de bornes ?',
    options: [
      { label: 'Pour', votes: 18 },
      { label: 'Contre', votes: 5 },
      { label: 'Neutre', votes: 3 },
    ],
    totalVotes: 26,
    endsAt: '25 mars 2026',
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useCopro', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns conversations from fixtures', () => {
    const { result } = renderHook(() => useCopro(), { wrapper: createWrapper() });

    expect(result.current.conversations).toHaveLength(1);
    expect(result.current.conversations[0].name).toBe('Groupe Residents');
  });

  it('returns annonces from fixtures', () => {
    const { result } = renderHook(() => useCopro(), { wrapper: createWrapper() });

    expect(result.current.annonces).toHaveLength(1);
    expect(result.current.annonces[0].title).toBe('Annonce test');
  });

  it('returns sondage with initial state', () => {
    const { result } = renderHook(() => useCopro(), { wrapper: createWrapper() });

    expect(result.current.sondage.question).toBe('Installation de bornes ?');
    expect(result.current.sondage.options).toHaveLength(3);
    expect(result.current.sondage.totalVotes).toBe(26);
    expect(result.current.sondage.hasVoted).toBe(false);
  });

  it('voteSondage increments the selected option votes', () => {
    const { result } = renderHook(() => useCopro(), { wrapper: createWrapper() });

    act(() => {
      result.current.voteSondage(0);
    });

    expect(result.current.sondage.options[0].votes).toBe(19);
    expect(result.current.sondage.options[1].votes).toBe(5);
    expect(result.current.sondage.options[2].votes).toBe(3);
    expect(result.current.sondage.totalVotes).toBe(27);
    expect(result.current.sondage.hasVoted).toBe(true);
  });

  it('voteSondage shows confirmation alert', () => {
    const { result } = renderHook(() => useCopro(), { wrapper: createWrapper() });

    act(() => {
      result.current.voteSondage(1);
    });

    expect(Alert.alert).toHaveBeenCalledWith('Vote enregistre !', 'Vous avez vote "Contre".');
  });

  it('prevents double voting', () => {
    const { result } = renderHook(() => useCopro(), { wrapper: createWrapper() });

    act(() => {
      result.current.voteSondage(0);
    });

    jest.clearAllMocks();

    act(() => {
      result.current.voteSondage(1);
    });

    // Votes should not change after second attempt
    expect(result.current.sondage.options[0].votes).toBe(19);
    expect(result.current.sondage.options[1].votes).toBe(5);
    expect(result.current.sondage.totalVotes).toBe(27);

    expect(Alert.alert).toHaveBeenCalledWith('Deja vote', 'Vous avez deja participe a ce sondage.');
  });

  it('exposes loading and error states', () => {
    const { result } = renderHook(() => useCopro(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeFalsy();
  });
});
