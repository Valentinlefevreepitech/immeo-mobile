import { ScrollView, View as RNView } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Info } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useConsentsStore } from '@/stores/consentsStore';
import { MOCK_VOISINS } from '@/fixtures/voisins';
import { Avatar } from '@/components/ui/Avatar';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ListRow, RowSeparator } from '@/components/ui/ListRow';
import { PageTransition } from '@/components/ui/PageTransition';

export default function VoisinsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const annuaireVisible = useConsentsStore((s) => s.annuaireVisible);

  const gardien = MOCK_VOISINS.filter((v) => v.role === 'gardien');
  const residents = MOCK_VOISINS.filter((v) => v.role !== 'gardien');
  const etages = Array.from(new Set(residents.map((v) => v.etage)));

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <PageTransition>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 130 }}
            showsVerticalScrollIndicator={false}
          >
            <YStack paddingHorizontal={24} paddingTop={20} paddingBottom={16}>
              <ScreenHeader title="Voisins" onBack={() => router.back()} />
            </YStack>

            <YStack paddingHorizontal={24} gap={22}>
              {!annuaireVisible && (
                <XStack
                  backgroundColor={colors.warningBg}
                  borderRadius={20}
                  paddingVertical={16}
                  paddingHorizontal={20}
                  alignItems="center"
                  gap={12}
                  pressStyle={{ opacity: 0.8 }}
                  onPress={() => router.push('/profil')}
                  role="button"
                  aria-label="Activer ma visibilité dans l'annuaire"
                >
                  <Info size={18} color={colors.warning} strokeWidth={2} />
                  <Text
                    flex={1}
                    fontFamily="$body"
                    fontSize={13}
                    fontWeight="600"
                    color={colors.warningText}
                  >
                    Vous n'apparaissez pas dans l'annuaire. Activez-le dans vos consentements pour
                    que vos voisins vous trouvent.
                  </Text>
                </XStack>
              )}

              {gardien.length > 0 && (
                <YStack gap={4}>
                  <SectionLabel>Gardien</SectionLabel>
                  {gardien.map((voisin, index) => (
                    <YStack key={voisin.id}>
                      {index > 0 && <RowSeparator />}
                      <ListRow paddingVertical={12} aria-label={voisin.nom}>
                        <Avatar initials={voisin.initials} size={44} variant="soft" />
                        <YStack flex={1}>
                          <Text
                            fontFamily="$body"
                            fontSize={15}
                            fontWeight="600"
                            color={colors.text.primary}
                          >
                            {voisin.nom}
                          </Text>
                          <Text
                            fontFamily="$body"
                            fontSize={13}
                            fontWeight="400"
                            color={colors.text.muted}
                          >
                            Gardien · {voisin.etage}
                          </Text>
                        </YStack>
                      </ListRow>
                    </YStack>
                  ))}
                </YStack>
              )}

              {etages.map((etage) => (
                <YStack key={etage} gap={4}>
                  <SectionLabel>{etage}</SectionLabel>
                  {residents
                    .filter((v) => v.etage === etage)
                    .map((voisin, index) => (
                      <YStack key={voisin.id}>
                        {index > 0 && <RowSeparator />}
                        <ListRow paddingVertical={12} aria-label={voisin.nom}>
                          <Avatar initials={voisin.initials} size={44} variant="soft" />
                          <YStack flex={1}>
                            <Text
                              fontFamily="$body"
                              fontSize={15}
                              fontWeight="600"
                              color={colors.text.primary}
                            >
                              {voisin.nom}
                            </Text>
                            <Text
                              fontFamily="$body"
                              fontSize={13}
                              fontWeight="400"
                              color={colors.text.muted}
                            >
                              {voisin.etage}
                            </Text>
                          </YStack>
                        </ListRow>
                      </YStack>
                    ))}
                </YStack>
              ))}

              <Text
                fontFamily="$body"
                fontSize={12}
                fontWeight="400"
                color={colors.text.muted}
                paddingHorizontal={8}
                lineHeight={18}
              >
                Seuls les résidents ayant activé leur visibilité apparaissent ici. La messagerie
                entre voisins arrive bientôt.
              </Text>
            </YStack>
          </ScrollView>
        </SafeAreaView>
      </PageTransition>
    </RNView>
  );
}
