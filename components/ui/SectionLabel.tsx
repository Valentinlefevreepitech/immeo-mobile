import { Text } from 'tamagui';
import { colors } from '@/constants/colors';

/** Label de section uppercase (prototype v2) : 13px/600, muted, +0.8 letter-spacing. */
export function SectionLabel({
  children,
  marginBottom = 6,
}: {
  children: string;
  marginBottom?: number;
}) {
  return (
    <Text
      fontFamily="$body"
      fontSize={13}
      fontWeight="600"
      color={colors.text.muted}
      textTransform="uppercase"
      letterSpacing={0.8}
      marginBottom={marginBottom}
      role="heading"
    >
      {children}
    </Text>
  );
}
