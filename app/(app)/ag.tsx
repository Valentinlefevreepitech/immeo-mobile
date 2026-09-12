import { useState } from 'react';
import { Alert, ScrollView, View as RNView } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Download } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRoleStore } from '@/stores/roleStore';
import { MOCK_AG, MOCK_AG_VOTE, MOCK_AG_DOCUMENTS } from '@/fixtures/ag';
import { GradientCard } from '@/components/ui/GradientCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ListRow, RowSeparator } from '@/components/ui/ListRow';
import { PageTransition } from '@/components/ui/PageTransition';

function VoteBlock() {
  const colors = useThemeColors();
  const [vote, setVote] = useState<string>('Pour');

  return (
    <YStack gap={12}>
      <XStack alignItems="center" gap={8}>
        <SectionLabel marginBottom={0}>Vote en ligne</SectionLabel>
        <View
          paddingHorizontal={8}
          paddingVertical={3}
          borderRadius={999}
          backgroundColor={colors.warningBg}
        >
          <Text fontFamily="$heading" fontSize={10} fontWeight="700" color={colors.warning}>
            BIENTÔT
          </Text>
        </View>
      </XStack>
      <YStack backgroundColor={colors.surface.card} borderRadius={24} padding={22} gap={14}>
        <YStack gap={2}>
          <Text fontFamily="$body" fontSize={12} fontWeight="600" color={colors.text.muted}>
            {MOCK_AG_VOTE.resolutionNumber}
          </Text>
          <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.text.primary}>
            {MOCK_AG_VOTE.resolutionTitle}
          </Text>
        </YStack>
        <XStack gap={8}>
          {MOCK_AG_VOTE.options.map((option) => {
            const isSelected = vote === option;
            return (
              <View
                key={option}
                flex={1}
                paddingVertical={12}
                borderRadius={999}
                alignItems="center"
                backgroundColor={isSelected ? colors.primary[500] : colors.white}
                pressStyle={{ scale: 0.96 }}
                onPress={() => setVote(option)}
                role="radio"
                aria-label={option}
                aria-selected={isSelected}
              >
                <Text
                  fontFamily="$heading"
                  fontSize={13}
                  fontWeight={isSelected ? '700' : '600'}
                  color={isSelected ? colors.white : colors.text.secondary}
                >
                  {option}
                </Text>
              </View>
            );
          })}
        </XStack>
        <Text
          fontFamily="$body"
          fontSize={12}
          fontWeight="400"
          color={colors.text.muted}
          textAlign="center"
        >
          {MOCK_AG_VOTE.mention}
        </Text>
      </YStack>
    </YStack>
  );
}

export default function AgScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const role = useRoleStore((s) => s.role);

  const handleDownload = (name: string) => {
    Alert.alert(name, 'Le téléchargement sera bientôt disponible.');
  };

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <PageTransition>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 130 }}
            showsVerticalScrollIndicator={false}
          >
            <YStack paddingHorizontal={24} paddingTop={20} paddingBottom={16}>
              <ScreenHeader title="Assemblée générale" onBack={() => router.replace('/')} />
            </YStack>

            <YStack paddingHorizontal={24} gap={24}>
              {/* Convocation officielle */}
              <GradientCard radius={28} padding={26}>
                <YStack gap={14}>
                  <Text
                    fontFamily="$heading"
                    fontSize={12}
                    fontWeight="700"
                    color={colors.primary[600]}
                    textTransform="uppercase"
                    letterSpacing={0.8}
                  >
                    {MOCK_AG.label}
                  </Text>
                  <Text
                    fontFamily="$heading"
                    fontSize={24}
                    fontWeight="800"
                    letterSpacing={-0.5}
                    lineHeight={30}
                    color={colors.primary[900]}
                  >
                    {MOCK_AG.title}
                    {'\n'}
                    {MOCK_AG.date}
                  </Text>
                  <Text
                    fontFamily="$body"
                    fontSize={13}
                    fontWeight="400"
                    color={colors.primary[600]}
                  >
                    {MOCK_AG.place}
                  </Text>
                  <XStack>
                    <XStack
                      alignItems="center"
                      gap={8}
                      backgroundColor={colors.white}
                      borderRadius={999}
                      paddingVertical={10}
                      paddingHorizontal={16}
                      pressStyle={{ scale: 0.95 }}
                      onPress={() => handleDownload(MOCK_AG.pdfLabel)}
                      role="button"
                      aria-label={MOCK_AG.pdfLabel}
                    >
                      <Download size={14} color={colors.primary[500]} strokeWidth={2} />
                      <Text
                        fontFamily="$body"
                        fontSize={13}
                        fontWeight="600"
                        color={colors.primary[500]}
                      >
                        {MOCK_AG.pdfLabel}
                      </Text>
                    </XStack>
                  </XStack>
                </YStack>
              </GradientCard>

              {/* Vote en ligne : copropriétaires uniquement (aperçu P1) */}
              {role === 'coproprietaire' && <VoteBlock />}

              {/* Documents préparatoires */}
              <YStack gap={4}>
                <SectionLabel>Documents préparatoires</SectionLabel>
                {MOCK_AG_DOCUMENTS.map((doc, index) => (
                  <YStack key={doc.id}>
                    {index > 0 && <RowSeparator />}
                    <ListRow
                      paddingVertical={12}
                      onPress={() => handleDownload(doc.title)}
                      aria-label={doc.title}
                    >
                      <YStack flex={1}>
                        <Text
                          fontFamily="$body"
                          fontSize={15}
                          fontWeight="600"
                          color={colors.text.primary}
                        >
                          {doc.title}
                        </Text>
                        <Text
                          fontFamily="$body"
                          fontSize={13}
                          fontWeight="400"
                          color={colors.text.muted}
                        >
                          {doc.subtitle}
                        </Text>
                      </YStack>
                      <Download size={18} color={colors.text.disabled} strokeWidth={2} />
                    </ListRow>
                  </YStack>
                ))}
              </YStack>
            </YStack>
          </ScrollView>
        </SafeAreaView>
      </PageTransition>
    </RNView>
  );
}
