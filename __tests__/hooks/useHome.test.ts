import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHome } from '@/hooks/useHome';

jest.mock('@/lib/supabase', () => ({ supabase: null }));
jest.mock('@/stores/authStore', () => ({
  useAuthStore: (selector: (s: { user: null }) => unknown) => selector({ user: null }),
}));

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useHome', () => {
  it('falls back to fixtures when supabase is unavailable', () => {
    const { result } = renderHook(() => useHome(), { wrapper: createWrapper() });

    expect(result.current.building.name).toBe('Résidence Les Jardins');
    expect(result.current.building.code).toBe('A4B7K9');
    expect(result.current.gardien.name).toBe('Michel Durand');
  });

  it('returns upcoming items in the shape the Accueil screen consumes', () => {
    const { result } = renderHook(() => useHome(), { wrapper: createWrapper() });

    expect(result.current.upcoming.length).toBeGreaterThan(0);
    const first = result.current.upcoming[0];
    expect(first).toHaveProperty('month');
    expect(first).toHaveProperty('day');
    expect(first).toHaveProperty('title');
    expect(first).toHaveProperty('subtitle');
    expect(first).toHaveProperty('accent');
  });

  it('exposes loading and error states', () => {
    const { result } = renderHook(() => useHome(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeFalsy();
  });
});
