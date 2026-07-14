import { XStack, View } from 'tamagui';
import { colors } from '@/constants/colors';

interface ListRowProps {
  children: React.ReactNode;
  onPress?: () => void;
  paddingVertical?: number;
  alignItems?: 'center' | 'flex-start';
  'aria-label'?: string;
}

/** Row de liste plate (prototype v2) : padding vertical 13, feedback opacity 0.6. */
export function ListRow({
  children,
  onPress,
  paddingVertical = 13,
  alignItems = 'center',
  'aria-label': ariaLabel,
}: ListRowProps) {
  return (
    <XStack
      alignItems={alignItems}
      gap={14}
      paddingVertical={paddingVertical}
      {...(onPress
        ? {
            onPress,
            pressStyle: { opacity: 0.6 },
            role: 'button' as const,
            'aria-label': ariaLabel,
          }
        : {})}
    >
      {children}
    </XStack>
  );
}

/** Séparateur 1px entre rows (pas de cartes par item — listes plates façon Revolut). */
export function RowSeparator() {
  return <View height={1} backgroundColor={colors.surface.separator} />;
}
