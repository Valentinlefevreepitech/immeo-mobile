import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { MOCK_CONVERSATIONS, MOCK_ANNONCES } from '@/fixtures/copro';
import type { Database } from '@/types/database';

type Chat = Database['public']['Tables']['chats']['Row'];
type Notification = Database['public']['Tables']['notifications']['Row'];

export function useCopro() {
  const user = useAuthStore((s) => s.user);

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

  return {
    conversations,
    annonces,
    isLoading: chatsQuery.isLoading || annoncesQuery.isLoading,
    error: chatsQuery.error || annoncesQuery.error,
  };
}
