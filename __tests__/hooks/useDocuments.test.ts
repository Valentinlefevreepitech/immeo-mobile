import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDocuments, getDownloadUrl } from '@/hooks/useDocuments';

jest.mock('@/lib/supabase', () => ({ supabase: null }));
jest.mock('@/stores/authStore', () => ({
  useAuthStore: (selector: (s: { user: null }) => unknown) => selector({ user: null }),
}));

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useDocuments', () => {
  it('falls back to fixtures when supabase is unavailable', () => {
    const { result } = renderHook(() => useDocuments(), { wrapper: createWrapper() });

    expect(result.current.docsLot.section).toBe('Mon logement (bail)');
    expect(result.current.docsLot.items.length).toBeGreaterThan(0);
    expect(result.current.docsCopro.length).toBeGreaterThan(0);
  });

  it('falls back to the static insurance reminder when no real data is loaded', () => {
    const { result } = renderHook(() => useDocuments(), { wrapper: createWrapper() });

    expect(result.current.alerte?.text).toContain("d'assurance");
  });

  it('exposes loading and error states', () => {
    const { result } = renderHook(() => useDocuments(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeFalsy();
  });
});

describe('getDownloadUrl', () => {
  it('returns the public url directly when present', async () => {
    const url = await getDownloadUrl({
      id: '1',
      title: 'Doc',
      subtitle: '',
      url: 'https://example.com/doc.pdf',
    });
    expect(url).toBe('https://example.com/doc.pdf');
  });

  it('returns null when neither url nor filePath is present', async () => {
    const url = await getDownloadUrl({ id: '1', title: 'Doc', subtitle: '' });
    expect(url).toBeNull();
  });
});
