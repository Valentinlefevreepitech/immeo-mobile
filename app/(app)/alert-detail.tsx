import { useLocalSearchParams, useRouter } from 'expo-router';
import { View as RNView, ScrollView } from 'react-native';
import { YStack, XStack, Text, View } from 'tamagui';
import { ChevronLeft, AlertCircle, Wrench, Megaphone } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';

const TYPE_CONFIG = {
  warning: {
    icon: AlertCircle,
    iconColor: colors.warning,
    bgColor: colors.warningBg,
    textColor: colors.warningText,
  },
  info: {
    icon: Wrench,
    iconColor: colors.info,
    bgColor: colors.infoBg,
    textColor: colors.infoText,
  },
  primary: {
    icon: Megaphone,
    iconColor: colors.primary[500],
    bgColor: colors.primary[50],
    textColor: colors.primary[800],
  },
} as const;

export default function AlertDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { title, detail, type } = useLocalSearchParams<{
    title: string;
    detail: string;
    type: 'warning' | 'info' | 'primary';
  }>();

  const config = TYPE_CONFIG[type ?? 'info'];
  const IconComponent = config.icon;

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <YStack paddingTop={insets.top + 8} paddingHorizontal={20} paddingBottom={16}>
          <View
            onPress={() => router.back()}
            pressStyle={{ opacity: 0.6 }}
            alignSelf="flex-start"
            padding={8}
            marginLeft={-8}
            borderRadius={12}
            accessibilityRole="button"
            accessibilityLabel="Retour"
          >
            <ChevronLeft size={24} color={colors.gray[900]} />
          </View>
        </YStack>

        {/* Card */}
        <YStack paddingHorizontal={20} gap={20}>
          <View backgroundColor={config.bgColor} borderRadius={20} padding={24} gap={16}>
            <XStack alignItems="center" gap={12}>
              <View
                width={40}
                height={40}
                borderRadius={20}
                backgroundColor={`${config.iconColor}22`}
                alignItems="center"
                justifyContent="center"
              >
                <IconComponent size={22} color={config.iconColor} />
              </View>
              <Text
                fontFamily="$heading"
                fontSize={20}
                fontWeight="700"
                color={config.textColor}
                flex={1}
              >
                {title}
              </Text>
            </XStack>

            <View height={1} backgroundColor={`${config.iconColor}20`} />

            <Text
              fontFamily="$body"
              fontSize={15}
              fontWeight="400"
              color={config.textColor}
              lineHeight={24}
            >
              {detail}
            </Text>
          </View>
        </YStack>
      </ScrollView>
    </RNView>
  );
}
