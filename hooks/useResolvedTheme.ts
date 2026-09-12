import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { useThemeStore } from '@/stores/themeStore';

/**
 * Resout le mode 'light' | 'dark' | 'system' du themeStore en un theme
 * concret 'light' | 'dark', en suivant les changements systeme en direct
 * quand le mode est 'system'.
 */
export function useResolvedTheme(): 'light' | 'dark' {
  const mode = useThemeStore((s) => s.mode);
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  const [systemScheme, setSystemScheme] = useState(Appearance.getColorScheme() ?? 'light');

  useEffect(() => {
    if (mode !== 'system') return;
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme ?? 'light');
    });
    return () => sub.remove();
  }, [mode]);

  if (mode === 'system') return systemScheme as 'light' | 'dark';
  return resolvedTheme();
}
