import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { IncidentCategory } from '@/types/database';
import type { Database } from '@/types/database';
import { MOCK_INCIDENTS, MOCK_TRAVAUX, MOCK_SYNDIC, type MockIncident } from '@/fixtures/incidents';

type IncidentRow = Database['public']['Tables']['incidents']['Row'];
type IncidentInsert = Database['public']['Tables']['incidents']['Insert'];
type TravauxRow = Database['public']['Tables']['travaux']['Row'];
type CabinetRow = Database['public']['Tables']['cabinets']['Row'];

export function useIncidents() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  // ── Incidents query ──
  const incidentsQuery = useQuery({
    queryKey: ['incidents', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return null;
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!supabase && !!user,
  });

  const incidents: MockIncident[] = useMemo(() => {
    if (!incidentsQuery.data) return MOCK_INCIDENTS;
    return incidentsQuery.data.map((inc: IncidentRow) => ({
      id: inc.id,
      title: inc.titre,
      category: inc.type,
      date: new Date(inc.created_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
      }),
      status: (inc.status ?? 'En attente') as MockIncident['status'],
    }));
  }, [incidentsQuery.data]);

  // ── Travaux query ──
  const travauxQuery = useQuery({
    queryKey: ['travaux'],
    queryFn: async () => {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('travaux')
        .select('*')
        .in('statut', ['planifie', 'en_cours'])
        .order('date_debut', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!supabase,
  });

  const travaux = useMemo(() => {
    if (!travauxQuery.data) return MOCK_TRAVAUX;
    return travauxQuery.data.map((t: TravauxRow) => ({
      id: t.id,
      title: t.titre,
      entreprise: t.entreprise_nom ?? '',
      status: (t.statut ?? 'planifie') as 'en_cours' | 'planifie',
      startDate: t.date_debut
        ? new Date(t.date_debut).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : '',
      endDate: t.date_fin_prevue
        ? new Date(t.date_fin_prevue).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : undefined,
      detail: [
        t.entreprise_nom ? `Entreprise : ${t.entreprise_nom}` : null,
        `Statut : ${t.statut === 'en_cours' ? 'En cours' : 'Planifie'}`,
        t.date_debut ? `Debut : ${new Date(t.date_debut).toLocaleDateString('fr-FR')}` : null,
        t.date_fin_prevue
          ? `Fin prevue : ${new Date(t.date_fin_prevue).toLocaleDateString('fr-FR')}`
          : null,
        t.description ?? null,
      ]
        .filter(Boolean)
        .join('\n'),
    }));
  }, [travauxQuery.data]);

  // ── Syndic (cabinet) query ──
  const syndicQuery = useQuery({
    queryKey: ['syndic'],
    queryFn: async () => {
      if (!supabase) return null;
      const { data, error } = await supabase.from('cabinets').select('*').limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!supabase,
  });

  const syndic = useMemo(() => {
    if (!syndicQuery.data) return MOCK_SYNDIC;
    const cab: CabinetRow = syndicQuery.data;
    return {
      name: cab.nom,
      phone: cab.telephone ?? '',
      email: cab.email_contact ?? '',
    };
  }, [syndicQuery.data]);

  // ── Create incident mutation ──
  const createIncidentMutation = useMutation({
    mutationFn: async (newIncident: IncidentInsert) => {
      if (!supabase) throw new Error('Service indisponible');
      const { data, error } = await supabase
        .from('incidents')
        .insert(newIncident)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });

  const createIncident = useCallback(
    (data: { title: string; category: IncidentCategory; description: string }) => {
      // Optimistic local update for immediate UI feedback
      const newIncident: MockIncident = {
        id: String(Date.now()),
        title: data.title,
        category: data.category,
        date: "Aujourd'hui",
        status: 'En attente',
      };

      // If supabase is connected, also persist remotely
      if (supabase && user) {
        createIncidentMutation.mutate({
          titre: data.title,
          type: data.category,
          description: data.description,
          status: 'En attente',
          created_by: user.id,
          cabinet_id: syndicQuery.data?.id ?? '',
          copropriete_id: '',
        });
      }

      // Keep the same behavior as before for immediate feedback
      setShowModal(false);
      Alert.alert(
        'Signalement envoye !',
        `Votre signalement "${data.title}" a ete transmis au syndic.`,
      );
    },
    [user, createIncidentMutation, syndicQuery.data],
  );

  const openModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return {
    incidents,
    travaux,
    syndic,
    showModal,
    createIncident,
    openModal,
    closeModal,
    isLoading: incidentsQuery.isLoading || travauxQuery.isLoading || syndicQuery.isLoading,
    error: incidentsQuery.error || travauxQuery.error || syndicQuery.error,
    isCreating: createIncidentMutation.isPending,
  };
}
