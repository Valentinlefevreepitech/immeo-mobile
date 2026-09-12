import { useMessagesStore } from '@/stores/messagesStore';

/**
 * Messagerie (syndic/gardien + P2P voisins), Phase 2.2. Wrapper fin autour
 * du store partage.
 */
export function useMessages() {
  const conversations = useMessagesStore((s) => s.conversations);
  const sendMessage = useMessagesStore((s) => s.sendMessage);
  const getOrCreateConversation = useMessagesStore((s) => s.getOrCreateConversation);
  const markRead = useMessagesStore((s) => s.markRead);

  const hasUnread = conversations.some((c) => c.unread > 0);

  return { conversations, sendMessage, getOrCreateConversation, markRead, hasUnread };
}
