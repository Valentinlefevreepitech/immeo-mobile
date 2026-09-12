import { useEffect, useRef } from 'react';
import { Tabs } from 'expo-router';
import { View, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { HandHelping, Megaphone, User } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '@/constants/colors';
import { useMessages } from '@/hooks/useMessages';
import { useNavTransitionStore } from '@/stores/navTransitionStore';
import { PulsingDot } from '@/components/ui/PulsingDot';

const ACTIVE_FG = colors.primary[500];
const IDLE_FG = colors.text.muted;
const ACTIVE_BG = colors.primary[50];
const ACTIVE_BORDER = colors.primary[200];

// Routes secondaires rattachées à l'onglet Accueil (tab bar visible, Accueil actif)
const ACCUEIL_GROUP = ['index', 'notifications', 'incidents', 'incident-detail', 'ag', 'documents'];
// Routes secondaires rattachées à l'onglet Copro (tab bar visible, Copro actif)
const COPRO_GROUP = ['copro', 'sondage-detail'];
// Routes secondaires rattachées à l'onglet Entraide (tab bar visible, Entraide actif)
const ENTRAIDE_GROUP = [
  'entraide',
  'entraide-fiche',
  'entraide-demande',
  'entraide-gestion',
  'conversation',
];
// Routes secondaires rattachées à l'onglet Profil (tab bar visible, Profil actif)
const PROFIL_GROUP = ['profil', 'appart', 'voisins'];
// Routes plein écran sans tab bar (flows de création)
const HIDDEN_ROUTES = ['signaler', 'sondage-creer', 'entraide-annonce'];
// Ordre de référence pour la direction du slide entre onglets (ordre visuel gauche→droite)
const TAB_ORDER: Record<string, number> = { index: 0, entraide: 1, profil: 2, copro: 3 };

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
  hasUnread,
  children,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  hasUnread?: boolean;
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
          <View style={styles.pillIconWrap}>
            {children}
            {hasUnread && (
              <View style={styles.pillUnreadDot}>
                <PulsingDot color={ACTIVE_FG} size={7} pulse />
              </View>
            )}
          </View>
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
 * Bouton rond isolé (Copro, annonces officielles + sondages) : simple
 * pression `scale(0.94–0.97)`.
 */
function IsolatedTabButton({
  active,
  label,
  icon,
  hasUnread,
  onPress,
}: {
  active: boolean;
  label: string;
  icon: (props: { size: number; color: string; strokeWidth: number }) => React.ReactNode;
  hasUnread?: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scale, { toValue: 0.94, duration: 100, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      role="tab"
      aria-label={label}
      aria-selected={active}
    >
      <Animated.View
        style={[
          styles.keyCircle,
          { transform: [{ scale }] },
          active && { backgroundColor: ACTIVE_BG, borderColor: ACTIVE_BORDER },
        ]}
      >
        {icon({ size: 23, color: active ? ACTIVE_FG : IDLE_FG, strokeWidth: 2 })}
        {hasUnread && (
          <View style={styles.unreadDot}>
            <PulsingDot color={ACTIVE_FG} size={9} pulse />
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { hasUnread } = useMessages();

  const focusedRoute = state.routes[state.index]?.name;
  if (HIDDEN_ROUTES.includes(focusedRoute)) return null;

  const activeTab = ACCUEIL_GROUP.includes(focusedRoute)
    ? 'index'
    : COPRO_GROUP.includes(focusedRoute)
      ? 'copro'
      : ENTRAIDE_GROUP.includes(focusedRoute)
        ? 'entraide'
        : PROFIL_GROUP.includes(focusedRoute)
          ? 'profil'
          : focusedRoute;

  const navigate = (name: string) => {
    const fromIndex = TAB_ORDER[activeTab] ?? 0;
    const toIndex = TAB_ORDER[name] ?? 0;
    useNavTransitionStore.getState().setDirection(toIndex >= fromIndex ? 'right' : 'left');

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
        {/* Pilule flottante : Accueil · Entraide · Profil */}
        <View style={styles.pill}>
          <TabPill label="Accueil" active={activeTab === 'index'} onPress={() => navigate('index')}>
            <HomeFilledIcon size={20} color={activeTab === 'index' ? ACTIVE_FG : IDLE_FG} />
          </TabPill>
          <TabPill
            label="Entraide"
            active={activeTab === 'entraide'}
            hasUnread={hasUnread}
            onPress={() => navigate('entraide')}
          >
            <HandHelping
              size={20}
              color={activeTab === 'entraide' ? ACTIVE_FG : IDLE_FG}
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

        {/* Bouton rond isolé « annonces officielles » = Copro */}
        <IsolatedTabButton
          active={activeTab === 'copro'}
          label="Copro"
          icon={({ size, color, strokeWidth }) => (
            <Megaphone size={size} color={color} strokeWidth={strokeWidth} />
          )}
          onPress={() => navigate('copro')}
        />
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
      <Tabs.Screen name="entraide" />
      <Tabs.Screen name="copro" />
      <Tabs.Screen name="profil" />
      <Tabs.Screen name="appart" options={{ href: null }} />
      <Tabs.Screen name="voisins" options={{ href: null }} />
      <Tabs.Screen name="conversation" options={{ href: null }} />
      {/* Routes secondaires (hors onglets) */}
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="incidents" options={{ href: null }} />
      <Tabs.Screen name="incident-detail" options={{ href: null }} />
      <Tabs.Screen name="signaler" options={{ href: null }} />
      <Tabs.Screen name="ag" options={{ href: null }} />
      <Tabs.Screen name="documents" options={{ href: null }} />
      <Tabs.Screen name="sondage-detail" options={{ href: null }} />
      <Tabs.Screen name="sondage-creer" options={{ href: null }} />
      <Tabs.Screen name="entraide-fiche" options={{ href: null }} />
      <Tabs.Screen name="entraide-demande" options={{ href: null }} />
      <Tabs.Screen name="entraide-gestion" options={{ href: null }} />
      <Tabs.Screen name="entraide-annonce" options={{ href: null }} />
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
  unreadDot: {
    position: 'absolute',
    top: 10,
    right: 12,
  },
  pillIconWrap: {
    position: 'relative',
  },
  pillUnreadDot: {
    position: 'absolute',
    top: -4,
    right: -6,
  },
});
