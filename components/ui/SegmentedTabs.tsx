import { XStack, View, Text } from 'tamagui';
import { useThemeColors } from '@/hooks/useThemeColors';

interface SegmentedTab {
  key: string;
  label: string;
}

/** Pilule segmentée générique (fond blanc + ombre sur l'onglet actif). */
export function SegmentedTabs({
  tabs,
  active,
  onSwitch,
}: {
  tabs: SegmentedTab[];
  active: string;
  onSwitch: (key: string) => void;
}) {
  const colors = useThemeColors();
  return (
    <XStack backgroundColor={colors.surface.card} borderRadius={999} padding={4} role="tablist">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <View
            key={tab.key}
            flex={1}
            paddingVertical={10}
            borderRadius={999}
            alignItems="center"
            backgroundColor={isActive ? colors.white : 'transparent'}
            {...(isActive
              ? {
                  shadowColor: '#0B0F0E',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                }
              : {})}
            onPress={() => onSwitch(tab.key)}
            role="tab"
            aria-label={tab.label}
            aria-selected={isActive}
          >
            <Text
              fontFamily="$body"
              fontSize={13}
              fontWeight="600"
              color={isActive ? colors.primary[500] : colors.text.muted}
            >
              {tab.label}
            </Text>
          </View>
        );
      })}
    </XStack>
  );
}
