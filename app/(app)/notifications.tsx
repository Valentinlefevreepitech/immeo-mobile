import { ScrollView, View as RNView } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, FileText, Megaphone, Wrench } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useRoleStore } from '@/stores/roleStore';
import { getNotifications, type NotificationIcon } from '@/fixtures/notifications';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ListRow, RowSeparator } from '@/components/ui/ListRow';
import { PageTransition } from '@/components/ui/PageTransition';

const ICON_CONFIG: Record<NotificationIcon, { Icon: typeof Wrench; fg: string; bg: string }> = {
  incident: { Icon: Wrench, fg: colors.info, bg: colors.infoBg },
  ag: { Icon: Calendar, fg: colors.primary[500], bg: colors.primary[50] },
  annonce: { Icon: Megaphone, fg: colors.text.muted, bg: colors.surface.card },
  document: { Icon: FileText, fg: colors.text.muted, bg: colors.surface.card },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const role = useRoleStore((s) => s.role);
  const sections = getNotifications(role);

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <PageTransition>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 130 }}
            showsVerticalScrollIndicator={false}
          >
            <YStack paddingHorizontal={24} paddingTop={20} paddingBottom={16}>
              <ScreenHeader title="Notifications" onBack={() => router.back()} />
            </YStack>

            <YStack paddingHorizontal={24}>
              {sections.map((section) => (
                <YStack key={section.id}>
                  <YStack paddingTop={12} paddingBottom={6}>
                    <SectionLabel marginBottom={0}>{section.label}</SectionLabel>
                  </YStack>
                  {section.items.map((item, index) => {
                    const { Icon, fg, bg } = ICON_CONFIG[item.icon];
                    return (
                      <YStack key={item.id}>
                        {index > 0 && <RowSeparator />}
                        <ListRow
                          alignItems="flex-start"
                          onPress={item.route ? () => router.push(item.route!) : undefined}
                          aria-label={item.title}
                        >
                          <View
                            width={40}
                            height={40}
                            borderRadius={20}
                            backgroundColor={bg}
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Icon size={18} color={fg} strokeWidth={2} />
                          </View>
                          <YStack flex={1} gap={2}>
                            <Text
                              fontFamily="$body"
                              fontSize={14}
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
                            <Text
                              fontFamily="$body"
                              fontSize={12}
                              fontWeight="400"
                              color={colors.text.disabled}
                            >
                              {item.time}
                            </Text>
                          </YStack>
                          {item.unread && (
                            <View
                              width={8}
                              height={8}
                              borderRadius={4}
                              backgroundColor={colors.primary[500]}
                              marginTop={6}
                            />
                          )}
                        </ListRow>
                      </YStack>
                    );
                  })}
                </YStack>
              ))}
            </YStack>
          </ScrollView>
        </SafeAreaView>
      </PageTransition>
    </RNView>
  );
}
