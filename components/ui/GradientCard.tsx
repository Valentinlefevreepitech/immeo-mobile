import { LinearGradient } from 'expo-linear-gradient';
import type { ViewStyle } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface GradientCardProps {
  children: React.ReactNode;
  radius?: number;
  padding?: number;
  style?: ViewStyle;
}

/** Carte hero gradient teal pastel (135deg #E6F5F2 → #C2E8E1) du prototype v2. */
export function GradientCard({ children, radius = 24, padding = 20, style }: GradientCardProps) {
  const colors = useThemeColors();
  return (
    <LinearGradient
      colors={colors.gradient.hero}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ borderRadius: radius, padding, overflow: 'hidden' }, style]}
    >
      {children}
    </LinearGradient>
  );
}
