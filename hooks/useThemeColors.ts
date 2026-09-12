import { colors, colorsDark } from '@/constants/colors';
import { useResolvedTheme } from './useResolvedTheme';

/**
 * Retourne `colors` ou `colorsDark` selon le theme resolu (voir
 * `constants/colors.ts`). Prepare la migration progressive des ecrans
 * (actuellement en import statique de `colors`) vers un rendu theme-aware.
 */
export function useThemeColors() {
  const theme = useResolvedTheme();
  return theme === 'dark' ? colorsDark : colors;
}
