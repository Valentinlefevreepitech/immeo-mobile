import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { useFocusEffect } from 'expo-router';

/**
 * Transition `pageIn` du prototype v2 : translateY 16px + fade, 0.45s,
 * rejouée à chaque focus de l'écran.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const anim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }).start();
    }, [anim]),
  );

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
      }}
    >
      {children}
    </Animated.View>
  );
}
