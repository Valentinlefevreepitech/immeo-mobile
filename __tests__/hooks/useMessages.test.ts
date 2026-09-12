import { renderHook, act } from '@testing-library/react-native';
import { useMessages } from '@/hooks/useMessages';
import { useMessagesStore } from '@/stores/messagesStore';

// Le store est un singleton partage entre tests : on le reset a chaque fois.
beforeEach(() => {
  useMessagesStore.setState(
    {
      conversations: [
        {
          id: 'foncia',
          name: 'Cabinet Foncia',
          initials: 'CF',
          subtitle: 'Gestionnaire',
          gradient: true,
          unread: 1,
          messages: [{ id: '1', from: 'them', text: 'Bonjour', time: '10:00' }],
        },
        {
          id: 'gardien',
          name: 'Michel Durand',
          initials: 'MD',
          subtitle: 'Gardien',
          unread: 0,
          messages: [],
        },
      ],
    },
    false,
  );
});

describe('useMessages', () => {
  it('returns the seeded conversations', () => {
    const { result } = renderHook(() => useMessages());

    expect(result.current.conversations).toHaveLength(2);
    expect(result.current.hasUnread).toBe(true);
  });

  it('sendMessage appends a message without touching unread', () => {
    const { result } = renderHook(() => useMessages());

    act(() => {
      result.current.sendMessage('gardien', 'Bonjour Michel !');
    });

    const gardien = result.current.conversations.find((c) => c.id === 'gardien');
    expect(gardien?.messages).toHaveLength(1);
    expect(gardien?.messages[0]).toMatchObject({ from: 'me', text: 'Bonjour Michel !' });
    expect(gardien?.unread).toBe(0);
  });

  it('getOrCreateConversation creates then reuses the same conversation', () => {
    const { result } = renderHook(() => useMessages());

    let firstId = '';
    act(() => {
      firstId = result.current.getOrCreateConversation({
        id: 'resident-karim',
        name: 'Karim B.',
        initials: 'KB',
        subtitle: '5ème étage',
      });
    });
    expect(result.current.conversations).toHaveLength(3);

    let secondId = '';
    act(() => {
      secondId = result.current.getOrCreateConversation({
        id: 'resident-karim',
        name: 'Karim B.',
        initials: 'KB',
        subtitle: '5ème étage',
      });
    });

    expect(secondId).toBe(firstId);
    expect(result.current.conversations).toHaveLength(3);
  });

  it('markRead resets unread to 0', () => {
    const { result } = renderHook(() => useMessages());

    act(() => {
      result.current.markRead('foncia');
    });

    expect(result.current.conversations.find((c) => c.id === 'foncia')?.unread).toBe(0);
    expect(result.current.hasUnread).toBe(false);
  });
});
