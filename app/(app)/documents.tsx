import { Alert, ScrollView, View as RNView } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Download, Upload } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRoleStore } from '@/stores/roleStore';
import {
  MOCK_DOCS_ALERTE,
  MOCK_DOCS_COPRO,
  getDocsLot,
  type MockDocument,
} from '@/fixtures/documents';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ListRow, RowSeparator } from '@/components/ui/ListRow';
import { PulsingDot } from '@/components/ui/PulsingDot';
import { PageTransition } from '@/components/ui/PageTransition';

function DocumentListRow({ doc, onPress }: { doc: MockDocument; onPress: () => void }) {
  const colors = useThemeColors();
  return (
    <ListRow paddingVertical={12} onPress={onPress} aria-label={doc.title}>
      <YStack flex={1}>
        <Text fontFamily="$body" fontSize={15} fontWeight="600" color={colors.text.primary}>
          {doc.title}
        </Text>
        <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
          {doc.subtitle}
        </Text>
      </YStack>
      {doc.action === 'chevron' ? (
        <ChevronRight size={16} color={colors.text.disabled} strokeWidth={2} />
      ) : (
        <Download size={18} color={colors.text.disabled} strokeWidth={2} />
      )}
    </ListRow>
  );
}

export default function DocumentsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const role = useRoleStore((s) => s.role);
  const docsLot = getDocsLot(role);

  const handleDocument = (name: string) => {
    Alert.alert(name, 'Le téléchargement sera bientôt disponible.');
  };

  const handleUpload = () => {
    Alert.alert('Déposer un document', 'Le dépôt de documents sera bientôt disponible.');
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
              <ScreenHeader title="Documents" onBack={() => router.back()} />
            </YStack>

            <YStack paddingHorizontal={24} gap={22}>
              {/* Bandeau alerte assurance */}
              <XStack
                backgroundColor={colors.warningBg}
                borderRadius={20}
                paddingVertical={16}
                paddingHorizontal={20}
                alignItems="center"
                gap={12}
                pressStyle={{ opacity: 0.8 }}
                onPress={handleUpload}
                role="button"
                aria-label={MOCK_DOCS_ALERTE.text}
              >
                <PulsingDot color={colors.warning} size={8} pulse />
                <Text
                  flex={1}
                  fontFamily="$body"
                  fontSize={13}
                  fontWeight="600"
                  color={colors.warningText}
                >
                  {MOCK_DOCS_ALERTE.text}
                </Text>
                <Text fontFamily="$heading" fontSize={13} fontWeight="700" color={colors.warning}>
                  {MOCK_DOCS_ALERTE.action}
                </Text>
              </XStack>

              {/* Mon logement / Mon lot (rôle-dépendant) */}
              <YStack gap={4}>
                <SectionLabel>{docsLot.section}</SectionLabel>
                {docsLot.items.map((doc, index) => (
                  <YStack key={doc.id}>
                    {index > 0 && <RowSeparator />}
                    <DocumentListRow doc={doc} onPress={() => handleDocument(doc.title)} />
                  </YStack>
                ))}
              </YStack>

              {/* Copropriété */}
              <YStack gap={4}>
                <SectionLabel>Copropriété</SectionLabel>
                {MOCK_DOCS_COPRO.map((doc, index) => (
                  <YStack key={doc.id}>
                    {index > 0 && <RowSeparator />}
                    <DocumentListRow doc={doc} onPress={() => handleDocument(doc.title)} />
                  </YStack>
                ))}
                <RowSeparator />
                <ListRow
                  paddingVertical={12}
                  onPress={handleUpload}
                  aria-label="Déposer un document"
                >
                  <View
                    width={40}
                    height={40}
                    borderRadius={20}
                    backgroundColor={colors.primary[50]}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Upload size={18} color={colors.primary[500]} strokeWidth={2} />
                  </View>
                  <YStack flex={1}>
                    <Text
                      fontFamily="$body"
                      fontSize={15}
                      fontWeight="600"
                      color={colors.primary[500]}
                    >
                      Déposer un document
                    </Text>
                    <Text
                      fontFamily="$body"
                      fontSize={13}
                      fontWeight="400"
                      color={colors.text.muted}
                    >
                      Attestation, RIB, justificatif…
                    </Text>
                  </YStack>
                </ListRow>
              </YStack>
            </YStack>
          </ScrollView>
        </SafeAreaView>
      </PageTransition>
    </RNView>
  );
}
