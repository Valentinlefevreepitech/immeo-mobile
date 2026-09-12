import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View as RNView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useMessages } from '@/hooks/useMessages';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { PageTransition } from '@/components/ui/PageTransition';

export default function ConversationScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { conversations, sendMessage, markRead } = useMessages();
  const conversation = conversations.find((c) => c.id === id);
  const [text, setText] = useState('');

  useEffect(() => {
    if (id) markRead(id);
  }, [id, markRead]);

  if (!conversation) {
    return (
      <RNView style={{ flex: 1, backgroundColor: colors.background }}>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <YStack paddingHorizontal={24} paddingTop={20}>
            <ScreenHeader title="Conversation" onBack={() => router.replace('/entraide')} />
          </YStack>
        </SafeAreaView>
      </RNView>
    );
  }

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(conversation.id, trimmed);
    setText('');
  };

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <PageTransition>
        <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
          >
            <YStack paddingHorizontal={24} paddingTop={20} paddingBottom={16}>
              <ScreenHeader
                title={conversation.name}
                subtitle={conversation.subtitle}
                onBack={() => router.replace('/entraide')}
              />
            </YStack>

            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 16, gap: 10 }}
              showsVerticalScrollIndicator={false}
            >
              {conversation.messages.length === 0 ? (
                <Text
                  fontFamily="$body"
                  fontSize={13}
                  fontWeight="400"
                  color={colors.text.muted}
                  textAlign="center"
                  paddingTop={40}
                >
                  Aucun message pour l'instant. Dites bonjour 👋
                </Text>
              ) : (
                conversation.messages.map((message) => (
                  <XStack
                    key={message.id}
                    justifyContent={message.from === 'me' ? 'flex-end' : 'flex-start'}
                  >
                    <YStack
                      maxWidth="80%"
                      backgroundColor={
                        message.from === 'me' ? colors.primary[500] : colors.surface.card
                      }
                      borderRadius={18}
                      paddingHorizontal={16}
                      paddingVertical={10}
                      gap={2}
                    >
                      <Text
                        fontFamily="$body"
                        fontSize={14}
                        fontWeight="400"
                        color={message.from === 'me' ? colors.white : colors.text.primary}
                        lineHeight={20}
                      >
                        {message.text}
                      </Text>
                      <Text
                        fontFamily="$body"
                        fontSize={11}
                        fontWeight="400"
                        color={message.from === 'me' ? 'rgba(255,255,255,0.7)' : colors.text.muted}
                      >
                        {message.time}
                      </Text>
                    </YStack>
                  </XStack>
                ))
              )}
            </ScrollView>

            <XStack
              paddingHorizontal={24}
              paddingVertical={16}
              gap={10}
              alignItems="center"
              backgroundColor={colors.background}
            >
              <TextInput
                placeholder="Écrire un message…"
                placeholderTextColor={colors.text.disabled}
                value={text}
                onChangeText={setText}
                onSubmitEditing={handleSend}
                aria-label="Message"
                style={{
                  flex: 1,
                  backgroundColor: colors.surface.card,
                  borderRadius: 999,
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                  fontFamily: 'Inter',
                  fontSize: 14,
                  color: colors.text.primary,
                }}
              />
              <View
                width={44}
                height={44}
                borderRadius={22}
                backgroundColor={colors.primary[500]}
                alignItems="center"
                justifyContent="center"
                opacity={text.trim() ? 1 : 0.5}
                pressStyle={text.trim() ? { scale: 0.95 } : {}}
                onPress={text.trim() ? handleSend : undefined}
                role="button"
                aria-label="Envoyer"
              >
                <Send size={18} color={colors.white} strokeWidth={2} />
              </View>
            </XStack>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </PageTransition>
    </RNView>
  );
}
