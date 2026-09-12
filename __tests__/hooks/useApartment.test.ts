import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useApartment } from '@/hooks/useApartment';

jest.mock('@/lib/supabase', () => ({ supabase: null }));
jest.mock('@/stores/authStore', () => ({
  useAuthStore: (selector: (s: { user: null }) => unknown) => selector({ user: null }),
}));

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useApartment', () => {
  it('falls back to fixture finance content when supabase is unavailable', () => {
    const { result } = renderHook(() => useApartment(), { wrapper: createWrapper() });

    expect(result.current.finance.title).toBe('Loyer mensuel');
    expect(result.current.finance.rows.length).toBeGreaterThan(0);
  });

  it('falls back to fixture logement tiles when supabase is unavailable', () => {
    const { result } = renderHook(() => useApartment(), { wrapper: createWrapper() });

    expect(result.current.logement.length).toBeGreaterThan(0);
    expect(result.current.logement[0]).toHaveProperty('value');
    expect(result.current.logement[0]).toHaveProperty('label');
  });

  it('exposes loading and error states', () => {
    const { result } = renderHook(() => useApartment(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeFalsy();
  });
});
