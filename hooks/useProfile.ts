import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { colors } from '@/constants/colors';
import type { Database } from '@/types/database';

type Owner = Database['public']['Tables']['owners']['Row'];

interface ProfileData {
  initials: string;
  fullName: string;
  email: string;
}

interface StatItem {
  value: string;
  label: string;
  valueColor?: string;
}

interface ProfileUpdateData {
  fullName: string;
  email: string;
  telephone?: string;
}

async function fetchOwnerByEmail(email: string): Promise<Owner | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('owners')
    .select('*')
    .eq('email', email)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function fetchOwnerStats(ownerId: string) {
  if (!supabase) return { apartmentType: null, floor: null, tenancyYears: null };

  // Get apartments linked to this owner
  const { data: ownerApartments, error: oaError } = await supabase
    .from('owner_apartments')
    .select('apartment_id')
    .eq('owner_id', ownerId);

  if (oaError) throw oaError;

  const apartmentIds = (ownerApartments ?? []).map((oa) => oa.apartment_id);

  if (apartmentIds.length === 0) {
    return { apartmentType: null, floor: null, tenancyYears: null };
  }

  // Get apartment details (first apartment for display)
  const { data: apartment, error: aptError } = await supabase
    .from('apartments')
    .select('type_lot, etage')
    .in('id', apartmentIds)
    .limit(1)
    .maybeSingle();

  if (aptError) throw aptError;

  // Get earliest tenant entry date for anciennete
  const { data: tenant, error: tError } = await supabase
    .from('tenants')
    .select('date_entree')
    .in('apartment_id', apartmentIds)
    .order('date_entree', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (tError) throw tError;

  let tenancyYears: number | null = null;
  if (tenant?.date_entree) {
    const entryDate = new Date(tenant.date_entree);
    const now = new Date();
    tenancyYears = Math.floor(
      (now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25),
    );
  }

  return {
    apartmentType: apartment?.type_lot ?? null,
    floor: apartment?.etage ?? null,
    tenancyYears,
  };
}

export function useProfile() {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch owner data from Supabase keyed on user email
  const ownerQuery = useQuery({
    queryKey: ['owner', user?.email],
    queryFn: () => fetchOwnerByEmail(user!.email),
    enabled: !!user?.email && !!supabase,
  });

  // Fetch real stats when we have an owner id
  const statsQuery = useQuery({
    queryKey: ['ownerStats', ownerQuery.data?.id],
    queryFn: () => fetchOwnerStats(ownerQuery.data!.id),
    enabled: !!ownerQuery.data?.id,
  });

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      if (!supabase || !user) throw new Error('Non authentifie');

      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: data.fullName.split(' ')[0],
          last_name: data.fullName.split(' ').slice(1).join(' '),
        },
      });
      if (authError) throw authError;

      // Update owners table if owner exists
      if (ownerQuery.data?.id) {
        const [prenom, ...lastParts] = data.fullName.split(' ');
        const { error: ownerError } = await supabase
          .from('owners')
          .update({
            prenom,
            nom: lastParts.join(' ') || prenom,
            email: data.email,
            telephone: data.telephone ?? null,
          })
          .eq('id', ownerQuery.data.id);
        if (ownerError) throw ownerError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', user?.email] });
      queryClient.invalidateQueries({ queryKey: ['ownerStats'] });
    },
  });

  // Build profile from auth store (base) enriched with owner data
  const profile: ProfileData = useMemo(() => {
    const owner = ownerQuery.data;
    if (owner) {
      const fullName = [owner.prenom, owner.nom].filter(Boolean).join(' ');
      const initials = fullName
        .split(' ')
        .map((s) => s[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      return {
        initials,
        fullName,
        email: owner.email || user?.email || '',
      };
    }

    return {
      initials: user?.initials || 'VL',
      fullName: user?.fullName || 'Valentin Lefevre',
      email: user?.email || 'valentin.lefevre@epitech.digital',
    };
  }, [user?.initials, user?.fullName, user?.email, ownerQuery.data]);

  // Build stats from real data, falling back to placeholders while loading
  const stats: StatItem[] = useMemo(() => {
    const s = statsQuery.data;
    return [
      {
        value: s?.apartmentType ?? '--',
        label: 'Appartement',
      },
      {
        value: s?.floor != null ? `${s.floor}eme` : '--',
        label: 'Etage',
      },
      {
        value:
          s?.tenancyYears != null ? `${s.tenancyYears} an${s.tenancyYears !== 1 ? 's' : ''}` : '--',
        label: 'Anciennete',
        valueColor: s?.tenancyYears != null ? colors.success : undefined,
      },
    ];
  }, [statsQuery.data]);

  const handleLogout = useCallback(() => {
    Alert.alert('Se deconnecter', 'Etes-vous sur de vouloir vous deconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Deconnecter',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  }, [logout]);

  return {
    profile,
    stats,
    handleLogout,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    isLoadingOwner: ownerQuery.isLoading,
    isLoadingStats: statsQuery.isLoading,
  };
}
