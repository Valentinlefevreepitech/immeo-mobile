import { useCallback, useRef } from 'react';
import { Animated, Easing, useWindowDimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';

/**
 * Transition "porte" de l'ecran Appart : `rotateY(-58deg -> 0)`, pivot sur
 * le bord gauche (simule via translateX ±width/2, RN ne supportant pas
 * `transform-origin` de facon fiable sur toutes les plateformes), perspective
 * 1400px, 0.65s. Jouee a chaque focus de l'ecran, apres la rotation de la
 * cle dans la nav bar (voir `AppartTabItem` dans `app/(app)/_layout.tsx`).
 */
export function DoorTransition({ children }: { children: React.ReactNode }) {
  const anim = useRef(new Animated.Value(1)).current;
  const { width } = useWindowDimensions();

  useFocusEffect(
    useCallback(() => {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 650,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }).start();
    }, [anim]),
  );

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: anim.interpolate({ inputRange: [0, 0.55, 1], outputRange: [0, 1, 1] }),
        transform: [
          { perspective: 1400 },
          { translateX: -width / 2 },
          { rotateY: anim.interpolate({ inputRange: [0, 1], outputRange: ['-58deg', '0deg'] }) },
          { translateX: width / 2 },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}
