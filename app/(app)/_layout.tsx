import { useEffect, useRef } from 'react';
import { Tabs } from 'expo-router';
import { View, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { MessageCircle, KeyRound, User } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '@/constants/colors';

const ACTIVE_FG = colors.primary[500];
const IDLE_FG = colors.text.muted;
const ACTIVE_BG = colors.primary[50];
const ACTIVE_BORDER = colors.primary[200];

// Routes secondaires rattachées à l'onglet Accueil (tab bar visible, Accueil actif)
const ACCUEIL_GROUP = ['index', 'notifications', 'incidents', 'incident-detail', 'ag', 'documents'];
// Routes plein écran sans tab bar (flow signalement)
const HIDDEN_ROUTES = ['signaler'];

function HomeFilledIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2.1L1 12h3v9h6v-6h4v6h6v-9h3L12 2.1z" fill={color} />
    </Svg>
  );
}

/**
 * Onglet de la pilule flottante : l'actif s'élargit (flex 1 → 1.7),
 * prend un fond pastel + contour teal et révèle son label (max-width + opacity).
 */
function TabPill({
  label,
  active,
  onPress,
  children,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  const anim = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: active ? 1 : 0,
      duration: 350,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: false,
    }).start();
  }, [active, anim]);

  return (
    <Animated.View
      style={{ flex: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] }) }}
    >
      <Pressable onPress={onPress} role="tab" aria-label={label} aria-selected={active}>
        <Animated.View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            paddingVertical: 11,
            borderRadius: 999,
            borderWidth: 1.5,
            borderColor: anim.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(153,217,206,0)', ACTIVE_BORDER],
            }),
            backgroundColor: anim.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(230,245,242,0)', ACTIVE_BG],
            }),
          }}
        >
          {children}
          <Animated.View
            style={{
              overflow: 'hidden',
              maxWidth: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 70] }),
              opacity: anim,
            }}
          >
            <Animated.Text
              numberOfLines={1}
              style={{ fontFamily: 'InterBold', fontSize: 12, color: ACTIVE_FG }}
            >
              {label}
            </Animated.Text>
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

/**
 * Bouton rond isolé « clé » = Mon appart.
 * Au repos la clé wiggle toutes les 6s ; au tap elle tourne de -90°
 * (comme dans une serrure) puis la navigation s'effectue.
 */
function KeyButton({ active, onActivate }: { active: boolean; onActivate: () => void }) {
  const rot = useRef(new Animated.Value(0)).current;
  const wiggle = useRef(new Animated.Value(0)).current;
  const wiggleLoop = useRef<Animated.CompositeAnimation | null>(null);
  const unlocking = useRef(false);

  useEffect(() => {
    if (active) {
      wiggleLoop.current?.stop();
      wiggle.setValue(0);
      Animated.timing(rot, { toValue: -90, duration: 250, useNativeDriver: true }).start();
      return;
    }

    unlocking.current = false;
    Animated.timing(rot, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    wiggleLoop.current = Animated.loop(
      Animated.sequence([
        Animated.delay(6000),
        Animated.timing(wiggle, { toValue: -16, duration: 160, useNativeDriver: true }),
        Animated.timing(wiggle, { toValue: 12, duration: 160, useNativeDriver: true }),
        Animated.timing(wiggle, { toValue: -6, duration: 130, useNativeDriver: true }),
        Animated.timing(wiggle, { toValue: 3, duration: 110, useNativeDriver: true }),
        Animated.timing(wiggle, { toValue: 0, duration: 110, useNativeDriver: true }),
      ]),
    );
    wiggleLoop.current.start();
    return () => wiggleLoop.current?.stop();
  }, [active, rot, wiggle]);

  const handlePress = () => {
    if (active || unlocking.current) return;
    unlocking.current = true;
    wiggleLoop.current?.stop();
    wiggle.setValue(0);
    Animated.timing(rot, {
      toValue: -90,
      duration: 620,
      easing: Easing.bezier(0.45, 0, 0.25, 1),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onActivate();
    });
  };

  const rotation = Animated.add(rot, wiggle).interpolate({
    inputRange: [-90, 0],
    outputRange: ['-90deg', '0deg'],
  });

  return (
    <Pressable onPress={handlePress} role="tab" aria-label="Mon appart" aria-selected={active}>
      <View
        style={[
          styles.keyCircle,
          active && { backgroundColor: ACTIVE_BG, borderColor: ACTIVE_BORDER },
        ]}
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <KeyRound size={23} color={active ? ACTIVE_FG : IDLE_FG} strokeWidth={2} />
        </Animated.View>
      </View>
    </Pressable>
  );
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const focusedRoute = state.routes[state.index]?.name;
  if (HIDDEN_ROUTES.includes(focusedRoute)) return null;

  const activeTab = ACCUEIL_GROUP.includes(focusedRoute) ? 'index' : focusedRoute;

  const navigate = (name: string) => {
    const route = state.routes.find((r) => r.name === name);
    const event = navigation.emit({
      type: 'tabPress',
      target: route?.key,
      canPreventDefault: true,
    });
    if (!event.defaultPrevented) {
      navigation.navigate(name);
    }
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Fondu blanc dégradé sous la barre */}
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.9)', '#FFFFFF']}
        locations={[0, 0.45, 0.8]}
        style={styles.gradient}
        pointerEvents="none"
      />

      <View style={styles.row} pointerEvents="box-none">
        {/* Pilule flottante : Accueil · Copro · Profil */}
        <View style={styles.pill}>
          <TabPill label="Accueil" active={activeTab === 'index'} onPress={() => navigate('index')}>
            <HomeFilledIcon size={20} color={activeTab === 'index' ? ACTIVE_FG : IDLE_FG} />
          </TabPill>
          <TabPill label="Copro" active={activeTab === 'copro'} onPress={() => navigate('copro')}>
            <MessageCircle
              size={20}
              color={activeTab === 'copro' ? ACTIVE_FG : IDLE_FG}
              strokeWidth={2}
            />
          </TabPill>
          <TabPill
            label="Profil"
            active={activeTab === 'profil'}
            onPress={() => navigate('profil')}
          >
            <User size={20} color={activeTab === 'profil' ? ACTIVE_FG : IDLE_FG} strokeWidth={2} />
          </TabPill>
        </View>

        {/* Bouton rond isolé « clé » = Mon appart */}
        <KeyButton active={activeTab === 'appart'} onActivate={() => navigate('appart')} />
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
      <Tabs.Screen name="profil" />
      <Tabs.Screen name="appart" />
      {/* Routes secondaires (hors onglets) */}
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="incidents" options={{ href: null }} />
      <Tabs.Screen name="incident-detail" options={{ href: null }} />
      <Tabs.Screen name="signaler" options={{ href: null }} />
      <Tabs.Screen name="ag" options={{ href: null }} />
      <Tabs.Screen name="documents" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 130,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 130,
  },
  row: {
    position: 'absolute',
    bottom: 28,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: colors.surface.separator,
    borderRadius: 999,
    padding: 6,
    shadowColor: '#0B0F0E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 10,
  },
  keyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1.5,
    borderColor: colors.surface.separator,
    shadowColor: '#0B0F0E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 10,
  },
});
