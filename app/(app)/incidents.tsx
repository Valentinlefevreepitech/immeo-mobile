import { ScrollView, View as RNView } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Plus } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
  MOCK_MES_SIGNALEMENTS,
  MOCK_INCIDENTS_IMMEUBLE,
  type IncidentV2,
} from '@/fixtures/incidents';
import { GradientCard } from '@/components/ui/GradientCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ListRow, RowSeparator } from '@/components/ui/ListRow';
import { StatusPill, statusDotColor } from '@/components/ui/StatusPill';
import { PulsingDot } from '@/components/ui/PulsingDot';
import { PageTransition } from '@/components/ui/PageTransition';

function IncidentListRow({ incident, onPress }: { incident: IncidentV2; onPress?: () => void }) {
  const colors = useThemeColors();
  return (
    <ListRow onPress={onPress} aria-label={incident.title}>
      <PulsingDot color={statusDotColor(incident.status, colors)} pulse={incident.pulse} />
      <YStack flex={1}>
        <Text fontFamily="$body" fontSize={15} fontWeight="600" color={colors.text.primary}>
          {incident.title}
        </Text>
        <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
          {incident.subtitle}
        </Text>
      </YStack>
      <StatusPill status={incident.status} />
    </ListRow>
  );
}

export default function IncidentsScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <PageTransition>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 130 }}
            showsVerticalScrollIndicator={false}
          >
            <YStack paddingHorizontal={24} paddingTop={20} paddingBottom={16}>
              <ScreenHeader title="Incidents" onBack={() => router.replace('/')} />
            </YStack>

            <YStack paddingHorizontal={24} gap={24}>
              {/* CTA déclarer */}
              <GradientCard radius={24} padding={20}>
                <XStack
                  alignItems="center"
                  gap={14}
                  onPress={() => router.push('/signaler')}
                  pressStyle={{ opacity: 0.8 }}
                  role="button"
                  aria-label="Déclarer un incident"
                >
                  <View
                    width={48}
                    height={48}
                    borderRadius={24}
                    backgroundColor={colors.primary[500]}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Plus size={22} color={colors.white} strokeWidth={2.2} />
                  </View>
                  <YStack flex={1}>
                    <Text
                      fontFamily="$heading"
                      fontSize={15}
                      fontWeight="700"
                      color={colors.primary[900]}
                    >
                      Déclarer un incident
                    </Text>
                    <Text
                      fontFamily="$body"
                      fontSize={13}
                      fontWeight="400"
                      color={colors.primary[600]}
                    >
                      Photo, localisation, catégorie
                    </Text>
                  </YStack>
                  <ChevronRight size={16} color={colors.primary[600]} strokeWidth={2} />
                </XStack>
              </GradientCard>

              {/* Mes signalements */}
              <YStack gap={4}>
                <SectionLabel>Mes signalements</SectionLabel>
                {MOCK_MES_SIGNALEMENTS.map((incident, index) => (
                  <YStack key={incident.id}>
                    {index > 0 && <RowSeparator />}
                    <IncidentListRow
                      incident={incident}
                      onPress={
                        incident.id === 'fuite-robinet'
                          ? () => router.push('/incident-detail')
                          : undefined
                      }
                    />
                  </YStack>
                ))}
              </YStack>

              {/* Incidents parties communes, visibles par tous */}
              <YStack gap={4}>
                <SectionLabel>Dans l'immeuble</SectionLabel>
                {MOCK_INCIDENTS_IMMEUBLE.map((incident, index) => (
                  <YStack key={incident.id}>
                    {index > 0 && <RowSeparator />}
                    <IncidentListRow incident={incident} />
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
