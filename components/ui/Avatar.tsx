import { Text } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '@/hooks/useThemeColors';

interface AvatarProps {
  initials: string;
  size?: number;
  /** 'gradient' = teal dégradé (par défaut), 'soft' = fond teal pastel */
  variant?: 'gradient' | 'soft';
}

export function Avatar({ initials, size = 40, variant = 'gradient' }: AvatarProps) {
  const colors = useThemeColors();
  const fontSize = Math.round(size * 0.34);

  if (variant === 'soft') {
    return (
      <LinearGradient
        colors={[colors.primary[50], colors.primary[50]]}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          fontFamily="$heading"
          fontSize={fontSize}
          fontWeight="700"
          color={colors.primary[500]}
        >
          {initials}
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={colors.gradient.avatar}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text fontFamily="$heading" fontSize={fontSize} fontWeight="700" color={colors.white}>
        {initials}
      </Text>
    </LinearGradient>
  );
}
