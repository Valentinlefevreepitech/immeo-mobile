import { XStack, Text, View } from 'tamagui';
import { Sun, Moon, Monitor } from 'lucide-react-native';
import { useThemeStore, type ThemeMode } from '@/stores/themeStore';
import { colors } from '@/constants/colors';

const OPTIONS: { mode: ThemeMode; icon: typeof Sun; label: string }[] = [
  { mode: 'light', icon: Sun, label: 'Clair' },
  { mode: 'dark', icon: Moon, label: 'Sombre' },
  { mode: 'system', icon: Monitor, label: 'Auto' },
];

export function ThemeToggle() {
  const currentMode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  return (
    <XStack paddingVertical="$4" gap="$3" justifyContent="center">
      {OPTIONS.map(({ mode, icon: Icon, label }) => {
        const active = currentMode === mode;
        return (
          <View
            key={mode}
            flex={1}
            alignItems="center"
            justifyContent="center"
            paddingVertical="$3"
            borderRadius="$3"
            backgroundColor={active ? '$teal1' : '$backgroundHover'}
            borderWidth={1.5}
            borderColor={active ? '$teal6' : '$borderColor'}
            pressStyle={{ opacity: 0.7 }}
            onPress={() => setMode(mode)}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected: active }}
          >
            <Icon size={20} color={active ? colors.primary[500] : colors.gray[500]} />
            <Text
              fontFamily="$body"
              fontSize={12}
              fontWeight={active ? '600' : '400'}
              color={active ? '$teal6' : '$placeholderColor'}
              marginTop="$1"
            >
              {label}
            </Text>
          </View>
        );
      })}
    </XStack>
  );
}
