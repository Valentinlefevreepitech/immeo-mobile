import { create } from 'zustand';

export interface Message {
  id: string;
  from: 'me' | 'them';
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  name: string;
  initials: string;
  subtitle: string;
  gradient?: boolean;
  messages: Message[];
  unread: number;
}

interface NewConversationInput {
  id: string;
  name: string;
  initials: string;
  subtitle: string;
}

interface MessagesState {
  conversations: Conversation[];
  sendMessage: (conversationId: string, text: string) => void;
  getOrCreateConversation: (input: NewConversationInput) => string;
  markRead: (conversationId: string) => void;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'foncia',
    name: 'Cabinet Foncia',
    initials: 'CF',
    subtitle: 'Gestionnaire · réponse sous 48h',
    gradient: true,
    unread: 1,
    messages: [
      {
        id: '1',
        from: 'me',
        text: 'Bonjour, une fuite est apparue sous mon évier.',
        time: '10:02',
      },
      {
        id: '2',
        from: 'them',
        text: 'Le plombier passera mercredi entre 9h et 12h',
        time: '14:32',
      },
    ],
  },
  {
    id: 'gardien',
    name: 'Michel Durand',
    initials: 'MD',
    subtitle: 'Gardien · Loge RDC',
    gradient: false,
    unread: 0,
    messages: [
      {
        id: '1',
        from: 'me',
        text: "Bonjour, j'attends un colis volumineux cette semaine.",
        time: 'Hier',
      },
      { id: '2', from: 'them', text: 'Colis récupéré à la loge 👍', time: 'Hier' },
    ],
  },
];

/**
 * Messagerie (Phase 2.2) : conversations syndic/gardien + P2P entre voisins,
 * entierement mock (pas de projet Supabase connecte). Meme pattern que
 * sondagesStore/entraideStore.
 */
export const useMessagesStore = create<MessagesState>((set, get) => ({
  conversations: INITIAL_CONVERSATIONS,

  sendMessage: (conversationId, text) => {
    const message: Message = { id: `${Date.now()}`, from: 'me', text, time: 'À l’instant' };
    set({
      conversations: get().conversations.map((c) =>
        c.id === conversationId ? { ...c, messages: [...c.messages, message] } : c,
      ),
    });
  },

  getOrCreateConversation: ({ id, name, initials, subtitle }) => {
    const existing = get().conversations.find((c) => c.id === id);
    if (existing) return existing.id;

    const conversation: Conversation = { id, name, initials, subtitle, unread: 0, messages: [] };
    set({ conversations: [...get().conversations, conversation] });
    return id;
  },

  markRead: (conversationId) => {
    set({
      conversations: get().conversations.map((c) =>
        c.id === conversationId ? { ...c, unread: 0 } : c,
      ),
    });
  },
}));
