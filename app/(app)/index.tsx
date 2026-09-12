import { useCallback, useState } from 'react';
import { ScrollView, View as RNView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  Calendar,
  Check,
  ChevronRight,
  CirclePlus,
  Copy,
  FileText,
  Wrench,
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAuthStore } from '@/stores/authStore';
import { useHome } from '@/hooks/useHome';
import { MOCK_HOME_ALERTS } from '@/fixtures/home';
import { Avatar } from '@/components/ui/Avatar';
import { GradientCard } from '@/components/ui/GradientCard';
import { ListRow, RowSeparator } from '@/components/ui/ListRow';
import { PulsingDot } from '@/components/ui/PulsingDot';
import { TabSlideTransition } from '@/components/ui/TabSlideTransition';

function QuickAction({
  icon,
  label,
  accent = false,
  badge = false,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  accent?: boolean;
  badge?: boolean;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  return (
    <YStack
      alignItems="center"
      gap={8}
      width={72}
      onPress={onPress}
      pressStyle={{ opacity: 0.7 }}
      role="button"
      aria-label={label}
    >
      <View
        width={56}
        height={56}
        borderRadius={28}
        backgroundColor={accent ? colors.primary[50] : colors.surface.card}
        alignItems="center"
        justifyContent="center"
        position="relative"
        pressStyle={{ scale: 0.92 }}
      >
        {icon}
        {badge && (
          <View
            position="absolute"
            top={2}
            right={2}
            width={10}
            height={10}
            borderRadius={5}
            backgroundColor={colors.warning}
            borderWidth={2}
            borderColor={colors.white}
          />
        )}
      </View>
      <Text fontFamily="$body" fontSize={12} fontWeight="500" color={colors.text.primary}>
        {label}
      </Text>
    </YStack>
  );
}

export default function AccueilScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const user = useAuthStore((s) => s.user);
  const { building, upcoming } = useHome();
  const [copied, setCopied] = useState(false);

  const firstName = user?.firstName || 'Valentin';
  const initials = user?.initials || 'VL';

  const handleCopyCode = useCallback(async () => {
    await Clipboard.setStringAsync(building.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [building.code]);

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <TabSlideTransition>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 130 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <XStack
              alignItems="center"
              gap={12}
              paddingHorizontal={24}
              paddingTop={16}
              paddingBottom={20}
            >
              <Avatar initials={initials} size={40} />
              <YStack flex={1}>
                <Text fontFamily="$body" fontSize={13} fontWeight="500" color={colors.text.muted}>
                  Bonjour {firstName}
                </Text>
                <Text
                  fontFamily="$heading"
                  fontSize={17}
                  fontWeight="700"
                  letterSpacing={-0.3}
                  color={colors.text.primary}
                >
                  {building.name}
                </Text>
              </YStack>
              <View
                width={40}
                height={40}
                borderRadius={20}
                backgroundColor={colors.surface.card}
                alignItems="center"
                justifyContent="center"
                position="relative"
                pressStyle={{ scale: 0.9 }}
                onPress={() => router.push('/notifications')}
                role="button"
                aria-label="Notifications"
              >
                <Bell size={18} color={colors.text.primary} strokeWidth={2} />
                <View position="absolute" top={4} right={5}>
                  <PulsingDot color={colors.warning} size={7} pulse />
                </View>
              </View>
            </XStack>

            <YStack paddingHorizontal={24} gap={26}>
              {/* Carte hero : code immeuble */}
              <GradientCard radius={28} padding={26}>
                <YStack gap={14}>
                  <Text
                    fontFamily="$body"
                    fontSize={13}
                    fontWeight="600"
                    color={colors.primary[600]}
                    letterSpacing={0.5}
                    textTransform="uppercase"
                  >
                    Code immeuble
                  </Text>
                  <Text
                    fontFamily="$heading"
                    fontSize={42}
                    fontWeight="800"
                    letterSpacing={10}
                    lineHeight={42}
                    color={colors.primary[900]}
                  >
                    {building.code}
                  </Text>
                  <XStack>
                    <XStack
                      alignItems="center"
                      gap={8}
                      backgroundColor={colors.white}
                      borderRadius={999}
                      paddingVertical={9}
                      paddingHorizontal={16}
                      pressStyle={{ scale: 0.95 }}
                      onPress={handleCopyCode}
                      role="button"
                      aria-label="Copier le code immeuble"
                    >
                      {copied ? (
                        <Check size={14} color={colors.primary[500]} strokeWidth={2.5} />
                      ) : (
                        <Copy size={14} color={colors.primary[500]} strokeWidth={2} />
                      )}
                      <Text
                        fontFamily="$body"
                        fontSize={13}
                        fontWeight="600"
                        color={colors.primary[500]}
                      >
                        {copied ? 'Copié' : 'Copier'}
                      </Text>
                    </XStack>
                  </XStack>
                </YStack>
              </GradientCard>

              {/* Actions rapides */}
              <XStack justifyContent="space-between">
                <QuickAction
                  icon={<CirclePlus size={22} color={colors.primary[500]} strokeWidth={1.8} />}
                  label="Signaler"
                  accent
                  onPress={() => router.push('/signaler')}
                />
                <QuickAction
                  icon={<Wrench size={22} color={colors.text.primary} strokeWidth={1.8} />}
                  label="Incidents"
                  onPress={() => router.push('/incidents')}
                />
                <QuickAction
                  icon={<FileText size={22} color={colors.text.primary} strokeWidth={1.8} />}
                  label="Documents"
                  onPress={() => router.push('/documents')}
                />
                <QuickAction
                  icon={<Calendar size={22} color={colors.text.primary} strokeWidth={1.8} />}
                  label="AG"
                  badge
                  onPress={() => router.push('/ag')}
                />
              </XStack>

              {/* À venir */}
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
                  À venir
                </Text>
                {upcoming.map((item, index) => (
                  <YStack key={item.id}>
                    {index > 0 && <RowSeparator />}
                    <ListRow
                      onPress={item.route ? () => router.push(item.route!) : undefined}
                      aria-label={item.title}
                    >
                      <View
                        width={44}
                        height={44}
                        borderRadius={16}
                        backgroundColor={item.accent ? colors.primary[50] : colors.surface.card}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text
                          fontFamily="$body"
                          fontSize={10}
                          fontWeight="600"
                          textTransform="uppercase"
                          color={item.accent ? colors.primary[500] : colors.text.muted}
                        >
                          {item.month}
                        </Text>
                        <Text
                          fontFamily="$heading"
                          fontSize={16}
                          fontWeight="800"
                          lineHeight={16}
                          color={item.accent ? colors.primary[500] : colors.text.primary}
                        >
                          {item.day}
                        </Text>
                      </View>
                      <YStack flex={1}>
                        <Text
                          fontFamily="$body"
                          fontSize={15}
                          fontWeight="600"
                          color={colors.text.primary}
                        >
                          {item.title}
                        </Text>
                        <Text
                          fontFamily="$body"
                          fontSize={13}
                          fontWeight="400"
                          color={colors.text.muted}
                        >
                          {item.subtitle}
                        </Text>
                      </YStack>
                      <ChevronRight size={16} color={colors.text.disabled} strokeWidth={2} />
                    </ListRow>
                  </YStack>
                ))}
              </YStack>

              {/* Alertes */}
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
                  Alertes
                </Text>
                {MOCK_HOME_ALERTS.map((item, index) => (
                  <YStack key={item.id}>
                    {index > 0 && <RowSeparator />}
                    <ListRow aria-label={item.title}>
                      <PulsingDot
                        color={item.color === 'warning' ? colors.warning : colors.primary[500]}
                        pulse={item.pulse}
                      />
                      <YStack flex={1}>
                        <Text
                          fontFamily="$body"
                          fontSize={15}
                          fontWeight="600"
                          color={colors.text.primary}
                        >
                          {item.title}
                        </Text>
                        <Text
                          fontFamily="$body"
                          fontSize={13}
                          fontWeight="400"
                          color={colors.text.muted}
                        >
                          {item.subtitle}
                        </Text>
                      </YStack>
                      <ChevronRight size={16} color={colors.text.disabled} strokeWidth={2} />
                    </ListRow>
                  </YStack>
                ))}
              </YStack>
            </YStack>
          </ScrollView>
        </SafeAreaView>
      </TabSlideTransition>
    </RNView>
  );
}
