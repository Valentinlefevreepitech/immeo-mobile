import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIncidents, useIncidentDetail } from '@/hooks/useIncidents';

jest.mock('@/lib/supabase', () => ({ supabase: null }));
jest.mock('@/stores/authStore', () => ({
  useAuthStore: (selector: (s: { user: null }) => unknown) => selector({ user: null }),
}));

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useIncidents', () => {
  it('falls back to fixtures when supabase is unavailable', () => {
    const { result } = renderHook(() => useIncidents(), { wrapper: createWrapper() });

    expect(result.current.mesSignalements.length).toBeGreaterThan(0);
    expect(result.current.incidentsImmeuble.length).toBeGreaterThan(0);
  });

  it('exposes loading and error states', () => {
    const { result } = renderHook(() => useIncidents(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeFalsy();
  });
});

describe('useIncidentDetail', () => {
  it('falls back to the fixture detail when no id is provided', () => {
    const { result } = renderHook(() => useIncidentDetail(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.incident.id).toBe('fuite-robinet');
    expect(result.current.incident.timeline.length).toBeGreaterThan(0);
  });
});
