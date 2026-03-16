import { memo } from 'react';
import type { ComponentType } from 'react';
import { YStack, XStack, Text, View } from 'tamagui';
import { Clock, RefreshCw, CheckCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import type { IncidentStatus } from '@/types/database';

type LucideIcon = ComponentType<{ size?: number; color?: string }>;

interface IncidentRowProps {
  title: string;
  category: string;
  date: string;
  status: IncidentStatus;
  onPress: () => void;
}

const statusConfig: Record<
  IncidentStatus,
  { label: string; bg: string; color: string; Icon: LucideIcon }
> = {
  'En attente': {
    label: 'En attente',
    bg: colors.warningBg,
    color: colors.warningText,
    Icon: Clock,
  },
  'En cours': {
    label: 'En cours',
    bg: colors.infoBg,
    color: colors.infoText,
    Icon: RefreshCw,
  },
  Résolu: {
    label: 'Resolu',
    bg: colors.successBg,
    color: colors.successText,
    Icon: CheckCircle,
  },
};

export const IncidentRow = memo(function IncidentRow({
  title,
  category,
  date,
  status,
  onPress,
}: IncidentRowProps) {
  const s = statusConfig[status];

  return (
    <View
      paddingVertical={14}
      pressStyle={{ opacity: 0.7 }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${category}, ${s.label}, ${date}`}
      accessibilityHint="Double-tapez pour voir les details du signalement"
    >
      <XStack gap={14} alignItems="center">
        <View
          width={44}
          height={44}
          borderRadius={12}
          backgroundColor={s.bg}
          alignItems="center"
          justifyContent="center"
        >
          <s.Icon size={20} color={s.color} />
        </View>
        <YStack flex={1} gap={2}>
          <Text fontFamily="$body" fontSize={15} fontWeight="600" color={colors.gray[900]}>
            {title}
          </Text>
          <XStack gap={8} alignItems="center">
            <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.gray[500]}>
              {category}
            </Text>
            <View width={3} height={3} borderRadius={2} backgroundColor={colors.gray[300]} />
            <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.gray[400]}>
              {date}
            </Text>
          </XStack>
        </YStack>
        <View paddingHorizontal={10} paddingVertical={4} borderRadius={10} backgroundColor={s.bg}>
          <Text fontFamily="$body" fontSize={11} fontWeight="600" color={s.color}>
            {s.label}
          </Text>
        </View>
      </XStack>
    </View>
  );
});
