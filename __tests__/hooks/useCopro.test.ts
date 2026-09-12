import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCopro } from '@/hooks/useCopro';

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
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useCopro', () => {
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

  it('exposes loading and error states', () => {
    const { result } = renderHook(() => useCopro(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeFalsy();
  });
});
