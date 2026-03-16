import { Tabs } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from 'tamagui';
import { MessageCircle, KeyRound, User } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { ComponentType } from 'react';
import { colors } from '@/constants/colors';
function HomeFilledIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Toit */}
      <Path d="M12 2.1L1 12h3v9h6v-6h4v6h6v-9h3L12 2.1z" fill={color} />
    </Svg>
  );
}

type TabIcon = ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}>;

const TAB_CONFIG: Record<string, { icon: TabIcon; label: string; noFill?: boolean }> = {
  index: { icon: HomeFilledIcon, label: 'Accueil' },
  copro: { icon: MessageCircle, label: 'Copro' },
  appart: { icon: KeyRound, label: 'Appart' },
  profil: { icon: User, label: 'Profil' },
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Gradient fade derriere la barre */}
      <LinearGradient
        colors={['rgba(247,249,252,0)', 'rgba(247,249,252,0.95)', 'rgba(247,249,252,1)']}
        locations={[0, 0.3, 0.7]}
        style={styles.gradient}
        pointerEvents="none"
      />

      {/* Floating bar */}
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const config = TAB_CONFIG[route.name];
          if (!config) return null;

          const focused = state.index === index;
          const IconComponent = config.icon;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabWrapper}
              accessibilityRole="tab"
              accessibilityLabel={config.label}
              accessibilityState={{ selected: focused }}
            >
              <View style={[styles.tab, focused && styles.tabActive]}>
                <IconComponent
                  size={20}
                  color={focused ? colors.primary[600] : colors.gray[700]}
                  fill={config.noFill ? 'none' : focused ? colors.primary[600] : colors.gray[700]}
                  strokeWidth={config.noFill ? 2.25 : 1.5}
                />
                <Text
                  fontFamily="$body"
                  fontSize={10}
                  fontWeight={focused ? '700' : '500'}
                  color={focused ? colors.primary[600] : colors.gray[700]}
                  marginTop={2}
                >
                  {config.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function AppLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      detachInactiveScreens={false}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="copro" />
      <Tabs.Screen name="signaler" options={{ href: null }} />
      <Tabs.Screen name="alert-detail" options={{ href: null }} />
      <Tabs.Screen name="appart" />
      <Tabs.Screen name="profil" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  bar: {
    position: 'absolute',
    bottom: 28,
    left: 12,
    right: 12,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  tabWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
});
