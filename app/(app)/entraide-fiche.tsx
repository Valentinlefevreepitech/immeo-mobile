import { ScrollView, View as RNView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Hammer, HandHelping, Package, Utensils, Wrench } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useEntraide } from '@/hooks/useEntraide';
import { Avatar } from '@/components/ui/Avatar';
import { GradientCard } from '@/components/ui/GradientCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { PillButton } from '@/components/ui/PillButton';
import { PageTransition } from '@/components/ui/PageTransition';

const ICONS = {
  wrench: Wrench,
  utensils: Utensils,
  hammer: Hammer,
  'hand-helping': HandHelping,
  package: Package,
};

export default function EntraideFicheScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { offers } = useEntraide();
  const offer = offers.find((o) => o.id === id) ?? offers[1];
  const Icon = ICONS[offer.icon];
  const emprunte = offer.statut === 'emprunte';

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <PageTransition>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 130 }}
            showsVerticalScrollIndicator={false}
          >
            <YStack paddingHorizontal={24} paddingTop={20} paddingBottom={16}>
              <ScreenHeader title="" onBack={() => router.replace('/entraide')} />
            </YStack>

            <YStack paddingHorizontal={24} gap={22}>
              <GradientCard radius={24} padding={0} style={{ height: 180, overflow: 'hidden' }}>
                <YStack flex={1} alignItems="center" justifyContent="center">
                  <Icon size={48} color={colors.primary[500]} strokeWidth={1.5} />
                </YStack>
              </GradientCard>

              <XStack gap={8}>
                <View
                  paddingHorizontal={10}
                  paddingVertical={4}
                  borderRadius={999}
                  backgroundColor={colors.primary[50]}
                >
                  <Text
                    fontFamily="$heading"
                    fontSize={11}
                    fontWeight="700"
                    color={colors.primary[500]}
                  >
                    {offer.categorie}
                  </Text>
                </View>
                <View
                  paddingHorizontal={10}
                  paddingVertical={4}
                  borderRadius={999}
                  backgroundColor={emprunte ? colors.surface.empty : colors.successBg}
                >
                  <Text
                    fontFamily="$heading"
                    fontSize={11}
                    fontWeight="700"
                    color={emprunte ? colors.text.muted : colors.successText}
                  >
                    {emprunte ? 'Emprunté' : 'Disponible'}
                  </Text>
                </View>
              </XStack>

              <YStack gap={8}>
                <Text
                  fontFamily="$heading"
                  fontSize={26}
                  fontWeight="800"
                  letterSpacing={-0.5}
                  color={colors.text.primary}
                >
                  {offer.titre}
                </Text>
                <Text
                  fontFamily="$body"
                  fontSize={14}
                  fontWeight="400"
                  color={colors.text.muted}
                  lineHeight={21}
                >
                  {offer.description}
                </Text>
              </YStack>

              {/* Propriétaire */}
              <XStack
                alignItems="center"
                gap={12}
                backgroundColor={colors.surface.card}
                borderRadius={20}
                padding={16}
              >
                <Avatar initials={offer.proprietaire.initials} size={48} variant="soft" />
                <YStack flex={1}>
                  <Text
                    fontFamily="$heading"
                    fontSize={15}
                    fontWeight="700"
                    color={colors.text.primary}
                  >
                    {offer.proprietaire.nom}
                  </Text>
                  <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
                    {offer.proprietaire.role === 'gardien'
                      ? 'Gardien'
                      : `${offer.proprietaire.etage}`}
                    {offer.proprietaire.role === 'gardien' ? ` · ${offer.proprietaire.etage}` : ''}
                    {offer.nbPrets ? ` · ${offer.nbPrets} prêts` : ''}
                  </Text>
                </YStack>
                {offer.note && (
                  <Text
                    fontFamily="$heading"
                    fontSize={14}
                    fontWeight="700"
                    color={colors.text.primary}
                  >
                    {offer.note}
                  </Text>
                )}
              </XStack>

              {/* Conditions */}
              <YStack gap={10}>
                <Text
                  fontFamily="$heading"
                  fontSize={14}
                  fontWeight="700"
                  color={colors.text.primary}
                >
                  Conditions
                </Text>
                <YStack gap={8}>
                  {offer.conditions.map((c) => (
                    <XStack key={c} alignItems="center" gap={10}>
                      <View
                        width={5}
                        height={5}
                        borderRadius={2.5}
                        backgroundColor={colors.text.muted}
                      />
                      <Text
                        fontFamily="$body"
                        fontSize={13}
                        fontWeight="400"
                        color={colors.text.secondary}
                      >
                        {c}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              </YStack>

              {/* Déjà réservé */}
              {offer.dejaReserve.length > 0 && (
                <YStack gap={10}>
                  <Text
                    fontFamily="$heading"
                    fontSize={14}
                    fontWeight="700"
                    color={colors.text.primary}
                  >
                    Déjà réservé
                  </Text>
                  <XStack gap={8} flexWrap="wrap">
                    {offer.dejaReserve.map((slot) => (
                      <View
                        key={slot.dateLabel}
                        paddingHorizontal={14}
                        paddingVertical={8}
                        borderRadius={999}
                        backgroundColor={colors.warningBg}
                      >
                        <Text
                          fontFamily="$body"
                          fontSize={12}
                          fontWeight="600"
                          color={colors.warning}
                        >
                          {slot.dateLabel}
                        </Text>
                      </View>
                    ))}
                  </XStack>
                </YStack>
              )}
            </YStack>
          </ScrollView>

          <YStack paddingHorizontal={24} paddingVertical={16}>
            <PillButton
              label={offer.demandeEnvoyee ? 'Demande envoyée' : 'Demander à emprunter'}
              disabled={emprunte || offer.demandeEnvoyee}
              onPress={() =>
                router.push({ pathname: '/entraide-demande', params: { id: offer.id } })
              }
            />
          </YStack>
        </SafeAreaView>
      </PageTransition>
    </RNView>
  );
}
