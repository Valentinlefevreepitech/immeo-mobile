import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { MOCK_CONVERSATIONS, MOCK_ANNONCES, MOCK_SONDAGE } from '@/fixtures/copro';
import type { Database } from '@/types/database';

type Chat = Database['public']['Tables']['chats']['Row'];
type Notification = Database['public']['Tables']['notifications']['Row'];
type CollectiveGoal = Database['public']['Tables']['collective_goals']['Row'];

export function useCopro() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // ── Conversations (chats) ──
  const chatsQuery = useQuery({
    queryKey: ['chats', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return null;
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('created_by', user.id)
        .order('date_dernier_message', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!supabase && !!user,
  });

  const conversations = useMemo(() => {
    if (!chatsQuery.data) return MOCK_CONVERSATIONS;
    return chatsQuery.data.map((chat: Chat) => ({
      id: chat.id,
      name: chat.participant_nom,
      initials: chat.participant_nom
        .split(' ')
        .map((s) => s[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      message: chat.dernier_message ?? '',
      time: chat.date_dernier_message
        ? new Date(chat.date_dernier_message).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '',
      unread: (chat.non_lus ?? 0) > 0,
      detail: chat.dernier_message
        ? `La messagerie sera bientot disponible.\n\nDernier message :\n"${chat.dernier_message}"`
        : 'La messagerie sera bientot disponible.',
    }));
  }, [chatsQuery.data]);

  // ── Annonces (notifications of type annonce/message) ──
  const annoncesQuery = useQuery({
    queryKey: ['annonces', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return null;
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .in('type', ['annonce', 'message'])
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!supabase && !!user,
  });

  const annonces = useMemo(() => {
    if (!annoncesQuery.data) return MOCK_ANNONCES;
    return annoncesQuery.data.map((notif: Notification) => ({
      id: notif.id,
      title: notif.title,
      content: notif.description ?? '',
      date: notif.created_at
        ? new Date(notif.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : '',
      author: '',
      detail: notif.description ?? '',
    }));
  }, [annoncesQuery.data]);

  // ── Sondage (collective_goals) ──
  const sondageQuery = useQuery({
    queryKey: ['sondage'],
    queryFn: async () => {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('collective_goals')
        .select('*')
        .eq('statut', 'actif')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!supabase,
  });

  // Local state for vote UI (used both with real data and fixtures)
  const [sondageOptions, setSondageOptions] = useState(MOCK_SONDAGE.options);
  const [sondageTotalVotes, setSondageTotalVotes] = useState(MOCK_SONDAGE.totalVotes);
  const [hasVoted, setHasVoted] = useState(false);

  const voteMutation = useMutation({
    mutationFn: async ({ goalId, newValue }: { goalId: string; newValue: number }) => {
      if (!supabase) throw new Error('Service indisponible');
      const { data, error } = await supabase
        .from('collective_goals')
        .update({ valeur_actuelle: newValue })
        .eq('id', goalId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sondage'] });
    },
  });

  const voteSondage = useCallback(
    (index: number) => {
      if (hasVoted) {
        Alert.alert('Deja vote', 'Vous avez deja participe a ce sondage.');
        return;
      }

      setSondageOptions((prev) =>
        prev.map((opt, i) => ({
          ...opt,
          votes: i === index ? opt.votes + 1 : opt.votes,
        })),
      );
      setSondageTotalVotes((prev) => prev + 1);
      setHasVoted(true);
      Alert.alert('Vote enregistre !', `Vous avez vote "${sondageOptions[index].label}".`);

      // If we have a real goal, also persist to Supabase
      const goal = sondageQuery.data;
      if (goal) {
        voteMutation.mutate({
          goalId: goal.id,
          newValue: (goal.valeur_actuelle ?? 0) + 1,
        });
      }
    },
    [hasVoted, sondageOptions, sondageQuery.data, voteMutation],
  );

  const sondage = useMemo(
    () => ({
      question: MOCK_SONDAGE.question,
      options: sondageOptions,
      totalVotes: sondageTotalVotes,
      endsAt: MOCK_SONDAGE.endsAt,
      hasVoted,
    }),
    [sondageOptions, sondageTotalVotes, hasVoted],
  );

  return {
    conversations,
    annonces,
    sondage,
    voteSondage,
    isLoading: chatsQuery.isLoading || annoncesQuery.isLoading || sondageQuery.isLoading,
    error: chatsQuery.error || annoncesQuery.error || sondageQuery.error,
    isVoting: voteMutation.isPending,
  };
}
