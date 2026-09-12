import { useCallback, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useNavTransitionStore } from '@/stores/navTransitionStore';

/**
 * Transition des 4 onglets principaux (Accueil/Copro/Profil/Appart) :
 * `translateX(±56px) + fade`, 0.45s, rejouee a chaque focus de l'ecran.
 * La direction vient de `navTransitionStore`, poussee par la nav bar au tap.
 */
export function TabSlideTransition({ children }: { children: React.ReactNode }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [fromOffset, setFromOffset] = useState(56);

  useFocusEffect(
    useCallback(() => {
      const direction = useNavTransitionStore.getState().direction;
      setFromOffset(direction === 'right' ? 56 : -56);
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 450,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }).start();
    }, [anim]),
  );

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: anim,
        transform: [
          { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [fromOffset, 0] }) },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}
