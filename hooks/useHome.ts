import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { fetchCopropriete, fetchCaretaker, fetchImportantDates } from '@/lib/api/home';
import { MOCK_BUILDING, MOCK_GARDIEN, MOCK_UPCOMING } from '@/fixtures/home';

function formatMonthShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
}

function formatDay(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit' });
}

export function useHome() {
  const coproprieteId = useAuthStore((s) => s.user?.coproprieteId);

  const buildingQuery = useQuery({
    queryKey: ['copropriete', coproprieteId],
    queryFn: () => fetchCopropriete(coproprieteId!),
    enabled: !!coproprieteId,
  });

  const gardienQuery = useQuery({
    queryKey: ['caretaker', coproprieteId],
    queryFn: () => fetchCaretaker(coproprieteId!),
    enabled: !!coproprieteId,
  });

  const datesQuery = useQuery({
    queryKey: ['important_dates', coproprieteId],
    queryFn: () => fetchImportantDates(coproprieteId!),
    enabled: !!coproprieteId,
  });

  const copropriete = buildingQuery.data;
  const caretaker = gardienQuery.data;
  const importantDates = datesQuery.data;

  // Map Supabase data to the shape screens expect, falling back to fixtures
  const building = copropriete
    ? { name: copropriete.nom, code: copropriete.code_acces ?? '' }
    : MOCK_BUILDING;

  const gardien = caretaker
    ? {
        name: [caretaker.first_name, caretaker.last_name].filter(Boolean).join(' '),
        phone: caretaker.phone ?? '',
        horaires: typeof caretaker.schedule === 'string' ? caretaker.schedule : '',
      }
    : MOCK_GARDIEN;

  const upcoming =
    importantDates && importantDates.length > 0
      ? importantDates.map((d, index) => ({
          id: String(d.id),
          month: formatMonthShort(d.date),
          day: formatDay(d.date),
          title: d.description ?? 'Échéance',
          subtitle: d.type === 'works' ? 'Travaux' : 'Date importante',
          accent: index === 0,
          route: undefined as string | undefined,
        }))
      : MOCK_UPCOMING;

  const isLoading = buildingQuery.isLoading || gardienQuery.isLoading || datesQuery.isLoading;

  const error = buildingQuery.error || gardienQuery.error || datesQuery.error;

  return { building, gardien, upcoming, isLoading, error };
}
