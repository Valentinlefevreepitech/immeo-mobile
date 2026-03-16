import { useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { YStack, XStack, Text, View, Separator } from 'tamagui';
import { PlusCircle, ChevronRight, Mail } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { IncidentStatus } from '@/types/database';
import type { MockIncident } from '@/fixtures/incidents';
import { useIncidents } from '@/hooks/useIncidents';
import { IncidentRow } from '@/components/features/signaler/IncidentRow';
import { TravauxCard } from '@/components/features/signaler/TravauxCard';
import { NewIncidentModal } from '@/components/features/signaler/NewIncidentModal';

export default function SignalerScreen() {
  const { incidents, travaux, syndic, showModal, createIncident, openModal, closeModal } =
    useIncidents();

  const handleIncidentPress = useCallback((incident: MockIncident) => {
    const statusLabels: Record<IncidentStatus, string> = {
      'En attente': 'En attente',
      'En cours': 'En cours',
      Résolu: 'Résolu',
    };
    Alert.alert(
      incident.title,
      `Categorie : ${incident.category}\nStatut : ${statusLabels[incident.status]}\nDate : ${incident.date}`,
    );
  }, []);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <NewIncidentModal visible={showModal} onClose={closeModal} onSubmit={createIncident} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <YStack paddingHorizontal={20} paddingTop={16} paddingBottom={12} gap={4}>
          <Text fontFamily="$body" fontSize={14} fontWeight="400" color={colors.gray[500]}>
            Incidents & travaux
          </Text>
          <Text
            fontFamily="$heading"
            fontSize={28}
            fontWeight="700"
            color={colors.gray[900]}
            accessibilityRole="header"
          >
            Signaler
          </Text>
        </YStack>

        <YStack paddingHorizontal={20} gap={24}>
          {/* CTA */}
          <View
            backgroundColor={colors.primary[500]}
            borderRadius={20}
            padding={24}
            gap={12}
            pressStyle={{ scale: 0.98, opacity: 0.9 }}
            onPress={openModal}
            accessibilityRole="button"
            accessibilityLabel="Signaler un probleme"
            accessibilityHint="Double-tapez pour ouvrir le formulaire de signalement"
          >
            <XStack gap={14} alignItems="center">
              <View
                width={52}
                height={52}
                borderRadius={16}
                backgroundColor={`${colors.white}22`}
                alignItems="center"
                justifyContent="center"
              >
                <PlusCircle size={28} color={colors.white} />
              </View>
              <YStack flex={1} gap={4}>
                <Text fontFamily="$heading" fontSize={18} fontWeight="700" color={colors.white}>
                  Signaler un probleme
                </Text>
                <Text fontFamily="$body" fontSize={13} fontWeight="400" color={`${colors.white}BB`}>
                  Plomberie, electricite, parties communes...
                </Text>
              </YStack>
              <ChevronRight size={20} color={`${colors.white}BB`} />
            </XStack>
          </View>

          {/* Mes signalements */}
          <YStack gap={12}>
            <SectionHeader title="Mes signalements" count={incidents.length} />
            <View backgroundColor={colors.white} borderRadius={16} paddingHorizontal={20}>
              {incidents.map((incident, index) => (
                <View key={incident.id}>
                  {index > 0 && <Separator borderColor={colors.gray[100]} />}
                  <IncidentRow
                    title={incident.title}
                    category={incident.category}
                    date={incident.date}
                    status={incident.status}
                    onPress={() => handleIncidentPress(incident)}
                  />
                </View>
              ))}
            </View>
          </YStack>

          {/* Travaux en cours */}
          <YStack gap={12}>
            <Text
              fontFamily="$heading"
              fontSize={20}
              fontWeight="700"
              color={colors.gray[900]}
              accessibilityRole="header"
            >
              Travaux en cours
            </Text>
            {travaux.map((travail) => (
              <TravauxCard
                key={travail.id}
                title={travail.title}
                entreprise={travail.entreprise}
                status={travail.status}
                startDate={travail.startDate}
                endDate={travail.endDate}
                onPress={() => Alert.alert(travail.title, travail.detail)}
              />
            ))}
          </YStack>

          {/* Contacter syndic */}
          <View
            backgroundColor={colors.secondary[50]}
            borderRadius={16}
            padding={20}
            pressStyle={{ scale: 0.98, opacity: 0.9 }}
            onPress={() => {
              Linking.openURL(`tel:${syndic.phone}`).catch(() => {
                Alert.alert(
                  'Contacter le syndic',
                  `${syndic.name}\nTel : ${syndic.phone.replace(/(\d{2})(?=\d)/g, '$1 ')}\nEmail : ${syndic.email}`,
                );
              });
            }}
            accessibilityRole="button"
            accessibilityLabel={`Contacter le syndic ${syndic.name}`}
            accessibilityHint="Double-tapez pour appeler le syndic"
          >
            <XStack gap={14} alignItems="center">
              <View
                width={44}
                height={44}
                borderRadius={12}
                backgroundColor={`${colors.secondary[500]}22`}
                alignItems="center"
                justifyContent="center"
              >
                <Mail size={22} color={colors.secondary[500]} />
              </View>
              <YStack flex={1}>
                <Text
                  fontFamily="$heading"
                  fontSize={15}
                  fontWeight="700"
                  color={colors.secondary[800]}
                >
                  Contacter le syndic
                </Text>
                <Text
                  fontFamily="$body"
                  fontSize={13}
                  fontWeight="400"
                  color={colors.secondary[600]}
                >
                  {syndic.name} - {syndic.phone.replace(/(\d{2})(?=\d)/g, '$1 ')}
                </Text>
              </YStack>
              <ChevronRight size={16} color={colors.secondary[400]} />
            </XStack>
          </View>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
