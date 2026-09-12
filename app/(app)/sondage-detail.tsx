import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View as RNView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useSondages } from '@/hooks/useSondages';
import type { SondageComment, SondageOption } from '@/fixtures/sondages';
import { Avatar } from '@/components/ui/Avatar';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { PillButton } from '@/components/ui/PillButton';
import { PageTransition } from '@/components/ui/PageTransition';

function ResultBar({
  option,
  totalVotes,
  selected,
}: {
  option: SondageOption;
  totalVotes: number;
  selected: boolean;
}) {
  const colors = useThemeColors();
  const pct = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

  return (
    <YStack gap={6}>
      <XStack justifyContent="space-between" alignItems="center">
        <Text
          fontFamily="$body"
          fontSize={14}
          fontWeight={selected ? '700' : '500'}
          color={selected ? colors.primary[500] : colors.text.primary}
        >
          {option.label}
        </Text>
        <Text
          fontFamily="$heading"
          fontSize={13}
          fontWeight="700"
          color={selected ? colors.primary[500] : colors.text.muted}
        >
          {pct}%
        </Text>
      </XStack>
      <View height={8} borderRadius={4} backgroundColor={colors.surface.empty} overflow="hidden">
        <View
          height={8}
          borderRadius={4}
          width={`${pct}%`}
          backgroundColor={selected ? colors.primary[500] : colors.primary[200]}
        />
      </View>
    </YStack>
  );
}

function CommentRow({ comment }: { comment: SondageComment }) {
  const colors = useThemeColors();
  return (
    <XStack gap={10}>
      <Avatar initials={comment.initials} size={32} />
      <YStack
        flex={1}
        backgroundColor={colors.surface.card}
        borderRadius={16}
        paddingVertical={12}
        paddingHorizontal={16}
        gap={2}
      >
        <Text fontFamily="$heading" fontSize={12} fontWeight="700" color={colors.text.primary}>
          {comment.author}
          {comment.role === 'gardien' ? ' · Gardien' : ''}
        </Text>
        <Text
          fontFamily="$body"
          fontSize={13}
          fontWeight="400"
          color={colors.text.secondary}
          lineHeight={19}
        >
          {comment.text}
        </Text>
      </YStack>
    </XStack>
  );
}

export default function SondageDetailScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { active, totalVotes, addComment } = useSondages();
  const [reply, setReply] = useState('');
  const [transmis, setTransmis] = useState(false);

  if (!active) {
    return (
      <RNView style={{ flex: 1, backgroundColor: colors.background }}>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <YStack padding={24}>
            <ScreenHeader title="Sondage" onBack={() => router.back()} />
          </YStack>
        </SafeAreaView>
      </RNView>
    );
  }

  const monVoteLabel = active.options.find((o) => o.id === active.monVote)?.label;

  const handleSend = () => {
    const text = reply.trim();
    if (!text) return;
    addComment(text);
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
                  title="Sondage"
                  onBack={() => router.back()}
                  trailing={
                    <View
                      paddingHorizontal={12}
                      paddingVertical={6}
                      borderRadius={999}
                      backgroundColor={
                        active.status === 'actif' ? colors.primary[50] : colors.surface.empty
                      }
                    >
                      <Text
                        fontFamily="$body"
                        fontSize={12}
                        fontWeight="600"
                        color={active.status === 'actif' ? colors.primary[500] : colors.text.muted}
                      >
                        {active.ouvertDepuisLabel}
                      </Text>
                    </View>
                  }
                />
              </YStack>

              <YStack paddingHorizontal={24} gap={26}>
                {/* Auteur + question + contexte */}
                <YStack gap={10}>
                  <XStack alignItems="center" gap={10}>
                    <Avatar initials={active.auteur.initials} size={36} variant="soft" />
                    <YStack>
                      <Text
                        fontFamily="$heading"
                        fontSize={13}
                        fontWeight="700"
                        color={colors.text.primary}
                      >
                        {active.auteur.nom} · {active.auteur.etage}
                      </Text>
                      <Text
                        fontFamily="$body"
                        fontSize={12}
                        fontWeight="400"
                        color={colors.text.muted}
                      >
                        {active.portee === 'immeuble' ? "Tout l'immeuble" : 'Mon étage'}
                      </Text>
                    </YStack>
                  </XStack>
                  <Text
                    fontFamily="$heading"
                    fontSize={24}
                    fontWeight="800"
                    letterSpacing={-0.5}
                    lineHeight={30}
                    color={colors.text.primary}
                  >
                    {active.question}
                  </Text>
                  {active.contexte ? (
                    <Text
                      fontFamily="$body"
                      fontSize={14}
                      fontWeight="400"
                      color={colors.text.muted}
                      lineHeight={21}
                    >
                      {active.contexte}
                    </Text>
                  ) : null}
                </YStack>

                {/* Résultats */}
                <YStack gap={14}>
                  <SectionLabel marginBottom={0}>Résultats</SectionLabel>
                  {active.options.map((opt) => (
                    <ResultBar
                      key={opt.id}
                      option={opt}
                      totalVotes={totalVotes}
                      selected={active.monVote === opt.id}
                    />
                  ))}
                  <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.text.muted}>
                    {totalVotes} votes · {active.totalLots} lots
                  </Text>
                  {monVoteLabel ? (
                    <Text
                      fontFamily="$body"
                      fontSize={13}
                      fontWeight="600"
                      color={colors.primary[500]}
                    >
                      Votre vote : {monVoteLabel}
                    </Text>
                  ) : null}
                </YStack>

                {/* Commentaires */}
                {active.commentairesActifs && (
                  <YStack gap={12}>
                    <SectionLabel marginBottom={0}>Commentaires</SectionLabel>
                    {active.comments.map((comment) => (
                      <CommentRow key={comment.id} comment={comment} />
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
                        placeholder="Ajouter un commentaire…"
                        placeholderTextColor={colors.text.disabled}
                        value={reply}
                        onChangeText={setReply}
                        onSubmitEditing={handleSend}
                        returnKeyType="send"
                        aria-label="Ajouter un commentaire"
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
                )}

                <PillButton
                  label={transmis ? 'Transmis au syndic' : 'Transmettre au syndic'}
                  variant="secondary"
                  disabled={transmis}
                  onPress={() => setTransmis(true)}
                />
              </YStack>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </PageTransition>
    </RNView>
  );
}
