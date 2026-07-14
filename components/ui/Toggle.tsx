import { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import { colors } from '@/constants/colors';

interface ToggleProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  'aria-label'?: string;
}

/** Toggle 44×26 du prototype v2 : track teal/gris, thumb blanc 20px animé. */
export function Toggle({ value, onValueChange, 'aria-label': ariaLabel }: ToggleProps) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  return (
    <Pressable
      onPress={() => onValueChange?.(!value)}
      role="switch"
      aria-checked={value}
      aria-label={ariaLabel}
      hitSlop={8}
    >
      <Animated.View
        style={{
          width: 44,
          height: 26,
          borderRadius: 13,
          backgroundColor: anim.interpolate({
            inputRange: [0, 1],
            outputRange: ['#DDE2E8', colors.primary[500]],
          }),
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: colors.white,
            transform: [
              { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [3, 21] }) },
            ],
          }}
        />
      </Animated.View>
    </Pressable>
  );
}
