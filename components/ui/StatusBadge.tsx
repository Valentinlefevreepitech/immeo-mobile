import { Text, View } from 'tamagui';

interface StatusBadgeProps {
  label: string;
  backgroundColor: string;
  textColor: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ label, backgroundColor, textColor, size = 'sm' }: StatusBadgeProps) {
  return (
    <View
      paddingHorizontal={10}
      paddingVertical={size === 'sm' ? 3 : 4}
      borderRadius={size === 'sm' ? 8 : 12}
      backgroundColor={backgroundColor}
      alignItems="center"
      accessibilityLabel={`Statut : ${label}`}
    >
      <Text
        fontFamily="$body"
        fontSize={size === 'sm' ? 11 : 12}
        fontWeight="600"
        color={textColor}
      >
        {label}
      </Text>
    </View>
  );
}
