import { XStack, Text } from 'tamagui';
import { colors } from '@/constants/colors';

interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      paddingVertical={12}
      accessibilityLabel={`${label} : ${value}`}
    >
      <Text fontFamily="$body" fontSize={14} fontWeight="400" color={colors.gray[500]}>
        {label}
      </Text>
      <Text fontFamily="$body" fontSize={14} fontWeight="600" color={colors.gray[900]}>
        {value}
      </Text>
    </XStack>
  );
}
