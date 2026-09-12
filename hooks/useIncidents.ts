import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import {
  fetchMesSignalements,
  fetchIncidentsImmeuble,
  fetchIncidentById,
  fetchCoproprieteCabinetId,
  insertIncident,
} from '@/lib/api/incidents';
import {
  MOCK_MES_SIGNALEMENTS,
  MOCK_INCIDENTS_IMMEUBLE,
  MOCK_INCIDENT_DETAIL,
  type IncidentV2,
  type IncidentStatusV2,
  type IncidentTimelineStep,
} from '@/fixtures/incidents';
import type { Database } from '@/types/database';

type IncidentRow = Database['public']['Tables']['incidents']['Row'];

function mapStatus(status: string | null): IncidentStatusV2 {
  switch (status) {
    case 'En cours':
      return 'intervention';
    case 'Résolu':
      return 'resolu';
    default:
      return 'declare';
  }
}

function formatDateFr(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function toIncidentV2(row: IncidentRow, localisation: 'privatif' | 'parties communes'): IncidentV2 {
  return {
    id: row.id,
    title: row.titre,
    subtitle: `${row.type} · ${localisation} · ${formatDateFr(row.reported_date ?? row.created_at)}`,
    status: mapStatus(row.status),
    pulse: row.status === 'En attente',
  };
}

export function useIncidents() {
  const user = useAuthStore((s) => s.user);
  const coproprieteId = useAuthStore((s) => s.user?.coproprieteId);

  const mesSignalementsQuery = useQuery({
    queryKey: ['incidents', 'mes-signalements', user?.id],
    queryFn: () => fetchMesSignalements(user!.id),
    enabled: !!user,
  });

  const incidentsImmeubleQuery = useQuery({
    queryKey: ['incidents', 'immeuble', coproprieteId],
    queryFn: () => fetchIncidentsImmeuble(coproprieteId!),
    enabled: !!coproprieteId,
  });

  const mesSignalements =
    mesSignalementsQuery.data && mesSignalementsQuery.data.length > 0
      ? mesSignalementsQuery.data.map((row) => toIncidentV2(row, 'privatif'))
      : MOCK_MES_SIGNALEMENTS;

  const incidentsImmeuble =
    incidentsImmeubleQuery.data && incidentsImmeubleQuery.data.length > 0
      ? incidentsImmeubleQuery.data.map((row) => toIncidentV2(row, 'parties communes'))
      : MOCK_INCIDENTS_IMMEUBLE;

  return {
    mesSignalements,
    incidentsImmeuble,
    isLoading: mesSignalementsQuery.isLoading || incidentsImmeubleQuery.isLoading,
    error: mesSignalementsQuery.error || incidentsImmeubleQuery.error,
  };
}

function buildTimeline(row: IncidentRow): IncidentTimelineStep[] {
  const steps: IncidentTimelineStep[] = [
    {
      label: 'Déclaré',
      date: row.reported_date ? formatDateFr(row.reported_date) : '',
      state: 'done',
    },
  ];

  if (row.status === 'Résolu' && row.resolved_date) {
    steps.push({
      label: 'Intervention',
      date: row.date_intervention ? formatDateFr(row.date_intervention) : '',
      state: 'done',
    });
    steps.push({ label: 'Résolu', date: formatDateFr(row.resolved_date), state: 'done' });
  } else if (row.date_intervention) {
    steps.push({
      label: 'Intervention planifiée',
      date: formatDateFr(row.date_intervention),
      state: 'current',
    });
    steps.push({ label: 'Résolu', date: '', state: 'pending' });
  } else {
    steps.push({ label: 'Intervention', date: '', state: 'current' });
    steps.push({ label: 'Résolu', date: '', state: 'pending' });
  }

  return steps;
}

export function useIncidentDetail(id: string | undefined) {
  const query = useQuery({
    queryKey: ['incidents', 'detail', id],
    queryFn: () => fetchIncidentById(id!),
    enabled: !!id,
  });

  const row = query.data;

  const incident = useMemo(() => {
    if (!row) return MOCK_INCIDENT_DETAIL;
    return {
      id: row.id,
      title: row.titre,
      subtitle: `${row.type} · déclaré le ${row.reported_date ? formatDateFr(row.reported_date) : ''}`,
      status: mapStatus(row.status),
      photos: row.photos?.length ?? 0,
      timeline: buildTimeline(row),
      comments: [],
    };
  }, [row]);

  return { incident, isLoading: query.isLoading, error: query.error };
}

export function useCreateIncident() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: {
      description: string;
      category: string;
      localisation: 'logement' | 'communes';
    }) => {
      if (!user?.coproprieteId) throw new Error('Copropriété inconnue');
      const cabinetId = await fetchCoproprieteCabinetId(user.coproprieteId);
      if (!cabinetId) throw new Error('Cabinet de gestion introuvable');

      const titre = input.description.trim().slice(0, 60) || input.category;

      return insertIncident({
        titre,
        description: input.description.trim(),
        type: input.category,
        created_by: user.id,
        cabinet_id: cabinetId,
        copropriete_id: user.coproprieteId,
        apartment_id: input.localisation === 'logement' ? (user.apartmentId ?? null) : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });

  return {
    createIncident: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}
