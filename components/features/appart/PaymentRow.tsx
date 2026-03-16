import { memo } from 'react';
import { XStack, Text, View } from 'tamagui';
import { colors } from '@/constants/colors';

interface PaymentRowProps {
  month: string;
  amount: string;
  status: 'paye' | 'en_attente' | 'en_retard';
  onPress: () => void;
}

const statusConfig = {
  paye: { label: 'Paye', bg: colors.successBg, color: colors.successText },
  en_attente: { label: 'A venir', bg: colors.gray[100], color: colors.gray[600] },
  en_retard: { label: 'En retard', bg: colors.dangerBg, color: colors.dangerText },
};

export const PaymentRow = memo(function PaymentRow({
  month,
  amount,
  status,
  onPress,
}: PaymentRowProps) {
  const s = statusConfig[status];

  return (
    <XStack
      paddingVertical={12}
      alignItems="center"
      gap={12}
      pressStyle={{ opacity: 0.7 }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${month}, ${amount}, ${s.label}`}
      accessibilityHint="Double-tapez pour voir les details du paiement"
    >
      <Text fontFamily="$body" fontSize={14} fontWeight="500" color={colors.gray[700]} flex={1}>
        {month}
      </Text>
      <Text fontFamily="$heading" fontSize={14} fontWeight="700" color={colors.gray[900]}>
        {amount}
      </Text>
      <View
        paddingHorizontal={10}
        paddingVertical={3}
        borderRadius={8}
        backgroundColor={s.bg}
        minWidth={70}
        alignItems="center"
      >
        <Text fontFamily="$body" fontSize={11} fontWeight="600" color={s.color}>
          {s.label}
        </Text>
      </View>
    </XStack>
  );
});
