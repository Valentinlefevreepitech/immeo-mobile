import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

/**
 * Charge les polices Inter et masque le splash screen
 * quand elles sont pretes.
 * Retourne true quand l'app est prete a s'afficher.
 */
export function useAppReady(): boolean {
  const [fontsLoaded, fontError] = useFonts({
    InterLight: require('@tamagui/font-inter/otf/Inter-Light.otf'),
    Inter: require('@tamagui/font-inter/otf/Inter-Regular.otf'),
    InterMedium: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterSemiBold: require('@tamagui/font-inter/otf/Inter-SemiBold.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    InterExtraBold: require('@tamagui/font-inter/otf/Inter-ExtraBold.otf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  return fontsLoaded || !!fontError;
}
