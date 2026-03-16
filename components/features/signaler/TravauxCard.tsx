import { memo } from 'react';
import { YStack, XStack, Text, View } from 'tamagui';
import { Calendar, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface TravauxCardProps {
  title: string;
  entreprise: string;
  status: 'planifie' | 'en_cours' | 'termine';
  startDate: string;
  endDate?: string;
  onPress: () => void;
}

const statusConfig = {
  planifie: { label: 'Planifie', bg: colors.secondary[50], color: colors.secondary[700] },
  en_cours: { label: 'En cours', bg: colors.infoBg, color: colors.infoText },
  termine: { label: 'Termine', bg: colors.successBg, color: colors.successText },
};

export const TravauxCard = memo(function TravauxCard({
  title,
  entreprise,
  status,
  startDate,
  endDate,
  onPress,
}: TravauxCardProps) {
  const s = statusConfig[status];

  return (
    <View
      backgroundColor={colors.white}
      borderRadius={16}
      padding={20}
      gap={12}
      pressStyle={{ opacity: 0.8 }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Travaux : ${title}, ${entreprise}, ${s.label}, du ${startDate}${endDate ? ` au ${endDate}` : ''}`}
      accessibilityHint="Double-tapez pour voir les details des travaux"
    >
      <XStack justifyContent="space-between" alignItems="flex-start">
        <YStack flex={1} gap={2}>
          <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.gray[900]}>
            {title}
          </Text>
          <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.gray[500]}>
            {entreprise}
          </Text>
        </YStack>
        <View paddingHorizontal={10} paddingVertical={4} borderRadius={10} backgroundColor={s.bg}>
          <Text fontFamily="$body" fontSize={11} fontWeight="600" color={s.color}>
            {s.label}
          </Text>
        </View>
      </XStack>
      <XStack gap={16} alignItems="center">
        <XStack gap={6} alignItems="center">
          <Calendar size={14} color={colors.gray[400]} />
          <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.gray[500]}>
            {startDate}
          </Text>
        </XStack>
        {endDate && (
          <>
            <ArrowRight size={12} color={colors.gray[300]} />
            <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.gray[500]}>
              {endDate}
            </Text>
          </>
        )}
      </XStack>
    </View>
  );
});
