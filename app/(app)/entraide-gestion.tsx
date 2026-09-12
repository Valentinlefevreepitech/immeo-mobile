import { ScrollView, View as RNView } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useEntraide } from '@/hooks/useEntraide';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ListRow, RowSeparator } from '@/components/ui/ListRow';
import { PillButton } from '@/components/ui/PillButton';
import { PulsingDot } from '@/components/ui/PulsingDot';
import { PageTransition } from '@/components/ui/PageTransition';

export default function EntraideGestionScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { demandesRecues, mesDemandes, mesAnnonces, accepterDemande, refuserDemande } =
    useEntraide();

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <PageTransition>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 130 }}
            showsVerticalScrollIndicator={false}
          >
            <YStack paddingHorizontal={24} paddingTop={20} paddingBottom={16}>
              <ScreenHeader title="Mes prêts" onBack={() => router.replace('/entraide')} />
            </YStack>

            <YStack paddingHorizontal={24} gap={26}>
              {/* Demandes reçues */}
              <YStack gap={12}>
                <SectionLabel marginBottom={0}>Demandes reçues</SectionLabel>
                {demandesRecues.length === 0 ? (
                  <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
                    Aucune demande pour le moment.
                  </Text>
                ) : (
                  demandesRecues.map((demande) => (
                    <YStack
                      key={demande.id}
                      backgroundColor={colors.surface.card}
                      borderRadius={20}
                      padding={18}
                      gap={10}
                    >
                      <Text
                        fontFamily="$heading"
                        fontSize={14}
                        fontWeight="700"
                        color={colors.text.primary}
                      >
                        {demande.demandeur.nom} · {demande.demandeur.etage}
                      </Text>
                      <Text
                        fontFamily="$body"
                        fontSize={13}
                        fontWeight="400"
                        color={colors.text.muted}
                      >
                        {demande.offerTitre} · {demande.dateLabel}
                      </Text>
                      <Text
                        fontFamily="$body"
                        fontSize={13}
                        fontWeight="400"
                        color={colors.text.secondary}
                        lineHeight={19}
                      >
                        « {demande.message} »
                      </Text>

                      {demande.statut === 'pending' && (
                        <XStack gap={10} marginTop={4}>
                          <View flex={1}>
                            <PillButton
                              label="Accepter"
                              onPress={() => accepterDemande(demande.id)}
                            />
                          </View>
                          <View flex={1}>
                            <PillButton
                              label="Refuser"
                              variant="secondary"
                              onPress={() => refuserDemande(demande.id)}
                            />
                          </View>
                        </XStack>
                      )}
                      {demande.statut === 'accepted' && (
                        <YStack
                          backgroundColor={colors.successBg}
                          borderRadius={14}
                          padding={12}
                          gap={4}
                          marginTop={4}
                        >
                          <Text
                            fontFamily="$heading"
                            fontSize={12}
                            fontWeight="700"
                            color={colors.successText}
                          >
                            Accepté · coordonnées partagées
                          </Text>
                          <XStack alignItems="center" justifyContent="space-between">
                            <Text
                              fontFamily="$body"
                              fontSize={13}
                              fontWeight="600"
                              color={colors.text.primary}
                            >
                              {demande.demandeur.telephone}
                            </Text>
                            <Text
                              fontFamily="$body"
                              fontSize={13}
                              fontWeight="600"
                              color={colors.primary[500]}
                            >
                              Message
                            </Text>
                          </XStack>
                        </YStack>
                      )}
                      {demande.statut === 'refused' && (
                        <Text
                          fontFamily="$body"
                          fontSize={12}
                          fontWeight="600"
                          color={colors.text.muted}
                          marginTop={4}
                        >
                          Demande refusée · {demande.demandeur.nom.split(' ')[0]} a été prévenu
                        </Text>
                      )}
                    </YStack>
                  ))
                )}
              </YStack>

              {/* Mes demandes en cours */}
              <YStack gap={4}>
                <SectionLabel>Mes demandes en cours</SectionLabel>
                {mesDemandes.map((demande, index) => (
                  <YStack key={demande.id}>
                    {index > 0 && <RowSeparator />}
                    <ListRow aria-label={demande.offerTitre}>
                      <YStack flex={1}>
                        <Text
                          fontFamily="$body"
                          fontSize={15}
                          fontWeight="600"
                          color={colors.text.primary}
                        >
                          {demande.offerTitre}
                        </Text>
                        <Text
                          fontFamily="$body"
                          fontSize={13}
                          fontWeight="400"
                          color={colors.text.muted}
                        >
                          {demande.proprietaireNom} · {demande.dateLabel}
                        </Text>
                      </YStack>
                      {demande.statut === 'pending' ? (
                        <XStack alignItems="center" gap={6}>
                          <PulsingDot color={colors.warning} size={8} pulse />
                          <Text
                            fontFamily="$body"
                            fontSize={12}
                            fontWeight="600"
                            color={colors.warning}
                          >
                            En attente
                          </Text>
                        </XStack>
                      ) : (
                        <Text
                          fontFamily="$body"
                          fontSize={12}
                          fontWeight="600"
                          color={colors.successDark}
                        >
                          Accepté
                        </Text>
                      )}
                    </ListRow>
                  </YStack>
                ))}
              </YStack>

              {/* Mes annonces */}
              <YStack gap={4}>
                <SectionLabel>Mes annonces</SectionLabel>
                {mesAnnonces.map((annonce, index) => (
                  <YStack key={annonce.id}>
                    {index > 0 && <RowSeparator />}
                    <ListRow aria-label={annonce.titre}>
                      <Text
                        flex={1}
                        fontFamily="$body"
                        fontSize={15}
                        fontWeight="600"
                        color={colors.text.primary}
                      >
                        {annonce.titre}
                      </Text>
                      <Text
                        fontFamily="$body"
                        fontSize={12}
                        fontWeight="600"
                        color={
                          annonce.statut === 'en_ligne' ? colors.successDark : colors.text.muted
                        }
                      >
                        {annonce.statut === 'en_ligne' ? 'En ligne' : 'Masquée'}
                      </Text>
                    </ListRow>
                  </YStack>
                ))}
                <XStack
                  alignItems="center"
                  justifyContent="center"
                  gap={8}
                  borderWidth={2}
                  borderStyle="dashed"
                  borderColor={colors.surface.empty}
                  borderRadius={16}
                  paddingVertical={14}
                  marginTop={8}
                  onPress={() => router.push('/entraide-annonce')}
                  pressStyle={{ scale: 0.98 }}
                  role="button"
                  aria-label="Nouvelle annonce"
                >
                  <Plus size={16} color={colors.text.muted} strokeWidth={2} />
                  <Text fontFamily="$body" fontSize={13} fontWeight="600" color={colors.text.muted}>
                    Nouvelle annonce
                  </Text>
                </XStack>
              </YStack>
            </YStack>
          </ScrollView>
        </SafeAreaView>
      </PageTransition>
    </RNView>
  );
}
