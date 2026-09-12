import { useState } from 'react';
import {
  ScrollView,
  TextInput,
  View as RNView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Image as ImageIcon, Send } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { MOCK_INCIDENT_DETAIL, type IncidentComment } from '@/fixtures/incidents';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { StatusPill } from '@/components/ui/StatusPill';
import { PulsingDot } from '@/components/ui/PulsingDot';
import { Avatar } from '@/components/ui/Avatar';
import { PageTransition } from '@/components/ui/PageTransition';

function PhotoPlaceholder({ tones }: { tones: readonly [string, string] }) {
  const colors = useThemeColors();
  return (
    <LinearGradient
      colors={tones}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
        height: 120,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ImageIcon size={28} color={colors.text.muted} strokeWidth={1.6} />
    </LinearGradient>
  );
}

function TimelineStep({
  label,
  date,
  state,
  isLast,
}: {
  label: string;
  date: string;
  state: 'done' | 'current' | 'pending';
  isLast: boolean;
}) {
  const colors = useThemeColors();
  return (
    <XStack gap={14}>
      <YStack alignItems="center" width={22}>
        {state === 'done' ? (
          <View
            width={22}
            height={22}
            borderRadius={11}
            backgroundColor={colors.primary[500]}
            alignItems="center"
            justifyContent="center"
          >
            <Check size={12} color={colors.white} strokeWidth={3} />
          </View>
        ) : state === 'current' ? (
          <PulsingDot color={colors.info} size={18} pulse />
        ) : (
          <View width={22} height={22} borderRadius={11} backgroundColor={colors.surface.empty} />
        )}
        {!isLast && (
          <View
            width={2}
            flex={1}
            backgroundColor={state === 'done' ? colors.primary[500] : colors.surface.empty}
          />
        )}
      </YStack>
      <YStack paddingBottom={isLast ? 0 : 18} flex={1}>
        <Text
          fontFamily="$body"
          fontSize={14}
          fontWeight={state === 'current' ? '700' : state === 'pending' ? '500' : '600'}
          color={
            state === 'current'
              ? colors.info
              : state === 'pending'
                ? colors.text.disabled
                : colors.text.primary
          }
        >
          {label}
        </Text>
        {date ? (
          <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.text.muted}>
            {date}
          </Text>
        ) : null}
      </YStack>
    </XStack>
  );
}

function CommentBubble({ comment }: { comment: IncidentComment }) {
  const colors = useThemeColors();
  if (comment.from === 'syndic') {
    return (
      <XStack gap={10}>
        <Avatar initials={comment.initials ?? 'CF'} size={32} />
        <View
          backgroundColor={colors.surface.card}
          borderTopLeftRadius={4}
          borderTopRightRadius={18}
          borderBottomLeftRadius={18}
          borderBottomRightRadius={18}
          paddingVertical={12}
          paddingHorizontal={16}
          maxWidth={260}
        >
          <Text
            fontFamily="$body"
            fontSize={13}
            fontWeight="400"
            color={colors.text.primary}
            lineHeight={19}
          >
            {comment.text}
          </Text>
        </View>
      </XStack>
    );
  }
  return (
    <XStack justifyContent="flex-end">
      <View
        backgroundColor={colors.primary[500]}
        borderTopLeftRadius={18}
        borderTopRightRadius={4}
        borderBottomLeftRadius={18}
        borderBottomRightRadius={18}
        paddingVertical={12}
        paddingHorizontal={16}
        maxWidth={260}
      >
        <Text
          fontFamily="$body"
          fontSize={13}
          fontWeight="400"
          color={colors.white}
          lineHeight={19}
        >
          {comment.text}
        </Text>
      </View>
    </XStack>
  );
}

export default function IncidentDetailScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const incident = MOCK_INCIDENT_DETAIL;
  const [comments, setComments] = useState<IncidentComment[]>(incident.comments);
  const [reply, setReply] = useState('');

  const handleSend = () => {
    const text = reply.trim();
    if (!text) return;
    setComments((prev) => [...prev, { id: String(prev.length + 1), from: 'resident', text }]);
    setReply('');
  };

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <PageTransition>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{ paddingBottom: 130 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <YStack paddingHorizontal={24} paddingTop={20} paddingBottom={16}>
                <ScreenHeader
                  title={incident.title}
                  subtitle={incident.subtitle}
                  onBack={() => router.replace('/incidents')}
                  trailing={<StatusPill status={incident.status} />}
                />
              </YStack>

              <YStack paddingHorizontal={24} gap={26}>
                {/* Photos */}
                <XStack gap={10}>
                  <PhotoPlaceholder tones={['#DDE2E8', '#C8CFD8']} />
                  <PhotoPlaceholder tones={['#E8EAEC', '#DDE2E8']} />
                </XStack>

                {/* Timeline de suivi */}
                <YStack>
                  <SectionLabel marginBottom={12}>Suivi</SectionLabel>
                  {incident.timeline.map((step, index) => (
                    <TimelineStep
                      key={step.label}
                      label={step.label}
                      date={step.date}
                      state={step.state}
                      isLast={index === incident.timeline.length - 1}
                    />
                  ))}
                </YStack>

                {/* Commentaires */}
                <YStack gap={12}>
                  <SectionLabel marginBottom={0}>Échanges</SectionLabel>
                  {comments.map((comment) => (
                    <CommentBubble key={comment.id} comment={comment} />
                  ))}
                  <XStack
                    alignItems="center"
                    gap={10}
                    backgroundColor={colors.surface.card}
                    borderRadius={999}
                    padding={6}
                    paddingLeft={20}
                    marginTop={4}
                  >
                    <TextInput
                      placeholder="Répondre…"
                      placeholderTextColor={colors.text.disabled}
                      value={reply}
                      onChangeText={setReply}
                      onSubmitEditing={handleSend}
                      returnKeyType="send"
                      aria-label="Répondre au syndic"
                      style={{
                        flex: 1,
                        fontFamily: 'Inter',
                        fontSize: 14,
                        color: colors.text.primary,
                        paddingVertical: 8,
                      }}
                    />
                    <View
                      width={38}
                      height={38}
                      borderRadius={19}
                      backgroundColor={colors.primary[500]}
                      alignItems="center"
                      justifyContent="center"
                      pressStyle={{ scale: 0.9 }}
                      onPress={handleSend}
                      role="button"
                      aria-label="Envoyer"
                    >
                      <Send size={16} color={colors.white} strokeWidth={2} />
                    </View>
                  </XStack>
                </YStack>
              </YStack>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </PageTransition>
    </RNView>
  );
}
