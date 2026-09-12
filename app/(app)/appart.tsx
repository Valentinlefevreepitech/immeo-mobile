import { ScrollView, View as RNView } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Clock, FileText } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useApartment } from '@/hooks/useApartment';
import { ListRow, RowSeparator } from '@/components/ui/ListRow';
import { PulsingDot } from '@/components/ui/PulsingDot';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { PageTransition } from '@/components/ui/PageTransition';

export default function AppartScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { finance, logement } = useApartment();

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <PageTransition>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 130 }}
            showsVerticalScrollIndicator={false}
          >
            <YStack paddingHorizontal={24} paddingTop={20} paddingBottom={16}>
              <ScreenHeader title="Mon appart" onBack={() => router.replace('/profil')} />
            </YStack>

            <YStack paddingHorizontal={24} gap={26}>
              {/* Hero finance (rôle-dépendant) */}
              <YStack gap={10} paddingTop={12}>
                <Text
                  fontFamily="$body"
                  fontSize={13}
                  fontWeight="500"
                  color={colors.text.muted}
                  textTransform="uppercase"
                  letterSpacing={0.8}
                >
                  {finance.title}
                </Text>
                <XStack alignItems="flex-end" gap={6}>
                  <Text
                    fontFamily="$heading"
                    fontSize={52}
                    fontWeight="800"
                    letterSpacing={-2}
                    lineHeight={52}
                    color={colors.text.primary}
                  >
                    {finance.amount}
                  </Text>
                  <Text
                    fontFamily="$body"
                    fontSize={16}
                    fontWeight="500"
                    color={colors.text.muted}
                    paddingBottom={4}
                  >
                    {finance.suffix}
                  </Text>
                </XStack>
                <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
                  {finance.detail}
                </Text>
                <XStack marginTop={4}>
                  <XStack
                    alignItems="center"
                    gap={8}
                    backgroundColor={colors.primary[50]}
                    borderRadius={999}
                    paddingVertical={8}
                    paddingHorizontal={16}
                  >
                    <PulsingDot color={colors.primary[500]} size={7} pulse />
                    <Text
                      fontFamily="$body"
                      fontSize={13}
                      fontWeight="600"
                      color={colors.primary[500]}
                    >
                      {finance.badge}
                    </Text>
                  </XStack>
                </XStack>
              </YStack>

              {/* Historique paiements / appels de fonds */}
              <YStack gap={4}>
                <Text
                  fontFamily="$heading"
                  fontSize={20}
                  fontWeight="700"
                  letterSpacing={-0.4}
                  color={colors.text.primary}
                  marginBottom={8}
                  role="heading"
                >
                  {finance.histTitle}
                </Text>
                {finance.rows.map((row, index) => (
                  <YStack key={row.id}>
                    {index > 0 && <RowSeparator />}
                    <ListRow paddingVertical={12} aria-label={row.title}>
                      <View
                        width={40}
                        height={40}
                        borderRadius={20}
                        backgroundColor={
                          row.status === 'paid' ? colors.successBg : colors.surface.card
                        }
                        alignItems="center"
                        justifyContent="center"
                      >
                        {row.status === 'paid' ? (
                          <Check size={18} color={colors.successDark} strokeWidth={2} />
                        ) : (
                          <Clock size={18} color={colors.text.muted} strokeWidth={2} />
                        )}
                      </View>
                      <YStack flex={1}>
                        <Text
                          fontFamily="$body"
                          fontSize={15}
                          fontWeight="600"
                          color={colors.text.primary}
                        >
                          {row.title}
                        </Text>
                        <Text
                          fontFamily="$body"
                          fontSize={13}
                          fontWeight="400"
                          color={colors.text.muted}
                        >
                          {row.subtitle}
                        </Text>
                      </YStack>
                      <Text
                        fontFamily="$heading"
                        fontSize={15}
                        fontWeight="700"
                        color={row.status === 'paid' ? colors.text.primary : colors.text.muted}
                      >
                        {row.amount}
                      </Text>
                    </ListRow>
                  </YStack>
                ))}
              </YStack>

              {/* Le logement */}
              <YStack gap={12}>
                <Text
                  fontFamily="$heading"
                  fontSize={20}
                  fontWeight="700"
                  letterSpacing={-0.4}
                  color={colors.text.primary}
                  role="heading"
                >
                  Le logement
                </Text>
                <XStack flexWrap="wrap" gap={12}>
                  {logement.map((tile) => (
                    <YStack
                      key={tile.id}
                      width="47%"
                      flexGrow={1}
                      backgroundColor={colors.surface.card}
                      borderRadius={20}
                      padding={18}
                      gap={2}
                    >
                      <Text
                        fontFamily="$heading"
                        fontSize={24}
                        fontWeight="800"
                        letterSpacing={-0.5}
                        color={colors.text.primary}
                      >
                        {tile.value}
                      </Text>
                      <Text
                        fontFamily="$body"
                        fontSize={12}
                        fontWeight="500"
                        color={colors.text.muted}
                      >
                        {tile.label}
                      </Text>
                    </YStack>
                  ))}
                  <YStack
                    width="47%"
                    flexGrow={1}
                    backgroundColor={colors.primary[50]}
                    borderRadius={20}
                    padding={18}
                    gap={2}
                    pressStyle={{ scale: 0.96 }}
                    onPress={() => router.push('/documents')}
                    role="button"
                    aria-label="Mes documents"
                  >
                    <FileText size={22} color={colors.primary[500]} strokeWidth={1.8} />
                    <Text
                      fontFamily="$body"
                      fontSize={12}
                      fontWeight="600"
                      color={colors.primary[500]}
                      marginTop={4}
                    >
                      Mes documents →
                    </Text>
                  </YStack>
                </XStack>
              </YStack>
            </YStack>
          </ScrollView>
        </SafeAreaView>
      </PageTransition>
    </RNView>
  );
}
