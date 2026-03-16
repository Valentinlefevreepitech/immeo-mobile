import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import {
  fetchCopropriete,
  fetchCaretaker,
  fetchImportantDates,
  fetchActiveAlerts,
} from '@/lib/api/home';
import { MOCK_BUILDING, MOCK_GARDIEN, MOCK_DATES, MOCK_ALERTS } from '@/fixtures/home';

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

  const alertsQuery = useQuery({
    queryKey: ['monitoring_alerts', 'active'],
    queryFn: fetchActiveAlerts,
    enabled: !!coproprieteId,
  });

  const copropriete = buildingQuery.data;
  const caretaker = gardienQuery.data;
  const importantDates = datesQuery.data;
  const monitoringAlerts = alertsQuery.data;

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

  const dates =
    importantDates && importantDates.length > 0
      ? importantDates.map((d) => ({
          id: String(d.id),
          label: d.description,
          date: d.date,
          detail: d.description,
          type: d.type as 'calendar' | 'works',
        }))
      : MOCK_DATES;

  const alerts =
    monitoringAlerts && monitoringAlerts.length > 0
      ? monitoringAlerts.map((a) => ({
          id: a.id,
          title: a.name,
          subtitle: a.description ?? '',
          detail: a.description ?? '',
          type: (a.severity === 'critical'
            ? 'warning'
            : a.severity === 'info'
              ? 'info'
              : 'primary') as 'warning' | 'info' | 'primary',
        }))
      : MOCK_ALERTS;

  const isLoading =
    buildingQuery.isLoading ||
    gardienQuery.isLoading ||
    datesQuery.isLoading ||
    alertsQuery.isLoading;

  const error = buildingQuery.error || gardienQuery.error || datesQuery.error || alertsQuery.error;

  return { building, gardien, dates, alerts, isLoading, error };
}
