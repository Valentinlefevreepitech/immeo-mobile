import { useCallback } from 'react';
import { ScrollView, View as RNView } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, Text } from 'tamagui';
import { Calendar, Wrench, AlertCircle, Megaphone } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useHome } from '@/hooks/useHome';
import { HeroHeader } from '@/components/features/home/HeroHeader';
import { CodeImmeubleCard } from '@/components/features/home/CodeImmeubleCard';
import { GardienCard } from '@/components/features/home/GardienCard';
import { DateRow } from '@/components/features/home/DateRow';
import { AlerteCard } from '@/components/features/home/AlerteCard';

export default function AccueilScreen() {
  const { building, gardien, dates, alerts } = useHome();
  const router = useRouter();

  const handleDatePress = useCallback(
    (item: { label: string; detail: string; type: string }) => {
      router.push({
        pathname: '/alert-detail',
        params: {
          title: item.label,
          detail: item.detail,
          type: item.type === 'calendar' ? 'primary' : 'info',
        },
      });
    },
    [router],
  );

  const handleAlertPress = useCallback(
    (item: { title: string; detail: string; type: string }) => {
      router.push({
        pathname: '/alert-detail',
        params: { title: item.title, detail: item.detail, type: item.type },
      });
    },
    [router],
  );

  // DEBUG: Test with pure RN ScrollView
  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <HeroHeader buildingName={building.name} />

        <YStack paddingHorizontal={20} gap={20} marginTop={-4}>
          <CodeImmeubleCard code={building.code} />
          <GardienCard name={gardien.name} phone={gardien.phone} horaires={gardien.horaires} />

          {/* Dates importantes */}
          <YStack gap={12}>
            <Text
              fontFamily="$heading"
              fontSize={20}
              fontWeight="700"
              color={colors.gray[900]}
              accessibilityRole="header"
            >
              Dates importantes
            </Text>
            {dates.map((item) => {
              const icon =
                item.type === 'calendar' ? (
                  <Calendar size={22} color={colors.primary[500]} />
                ) : (
                  <Wrench size={22} color={colors.info} />
                );
              const iconColor = item.type === 'calendar' ? colors.primary[500] : colors.info;

              return (
                <DateRow
                  key={item.id}
                  icon={icon}
                  iconColor={iconColor}
                  label={item.label}
                  date={item.date}
                  onPress={() => handleDatePress(item)}
                />
              );
            })}
          </YStack>

          {/* Alertes */}
          <YStack gap={12}>
            <Text
              fontFamily="$heading"
              fontSize={20}
              fontWeight="700"
              color={colors.gray[900]}
              accessibilityRole="header"
            >
              Alertes
            </Text>
            {alerts.map((item) => {
              let icon: React.ReactNode;
              let iconColor: string;
              let bgColor: string;
              let textColor: string;

              switch (item.type) {
                case 'warning':
                  icon = <AlertCircle size={18} color={colors.warning} />;
                  iconColor = colors.warning;
                  bgColor = colors.warningBg;
                  textColor = colors.warningText;
                  break;
                case 'info':
                  icon = <Wrench size={18} color={colors.info} />;
                  iconColor = colors.info;
                  bgColor = colors.infoBg;
                  textColor = colors.infoText;
                  break;
                case 'primary':
                  icon = <Megaphone size={18} color={colors.primary[500]} />;
                  iconColor = colors.primary[500];
                  bgColor = colors.primary[50];
                  textColor = colors.primary[800];
                  break;
              }

              return (
                <AlerteCard
                  key={item.id}
                  icon={icon}
                  iconColor={iconColor}
                  bgColor={bgColor}
                  textColor={textColor}
                  title={item.title}
                  subtitle={item.subtitle}
                  onPress={() => handleAlertPress(item)}
                />
              );
            })}
          </YStack>
        </YStack>
      </ScrollView>
    </RNView>
  );
}
