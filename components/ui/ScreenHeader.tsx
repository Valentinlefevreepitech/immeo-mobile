import { XStack, YStack, Text, View } from 'tamagui';
import { ChevronLeft, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  /** 'back' = chevron (par défaut), 'close' = croix (flows modaux) */
  icon?: 'back' | 'close';
  trailing?: React.ReactNode;
}

/** Header d'écran secondaire : bouton rond gris + titre (prototype v2). */
export function ScreenHeader({
  title,
  subtitle,
  onBack,
  icon = 'back',
  trailing,
}: ScreenHeaderProps) {
  const Icon = icon === 'close' ? X : ChevronLeft;
  const compact = !!subtitle;

  return (
    <XStack alignItems="center" gap={12}>
      <View
        width={40}
        height={40}
        borderRadius={20}
        backgroundColor={colors.surface.card}
        alignItems="center"
        justifyContent="center"
        pressStyle={{ scale: 0.9 }}
        onPress={onBack}
        role="button"
        aria-label={icon === 'close' ? 'Fermer' : 'Retour'}
      >
        <Icon size={icon === 'close' ? 16 : 18} color={colors.text.primary} strokeWidth={2} />
      </View>
      <YStack flex={1}>
        <Text
          fontFamily="$heading"
          fontSize={compact ? 20 : 26}
          fontWeight="800"
          letterSpacing={compact ? -0.4 : -0.6}
          color={colors.text.primary}
          role="heading"
        >
          {title}
        </Text>
        {subtitle ? (
          <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
            {subtitle}
          </Text>
        ) : null}
      </YStack>
      {trailing}
    </XStack>
  );
}
