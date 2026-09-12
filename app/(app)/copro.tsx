import { useState } from 'react';
import { Alert, ScrollView, View as RNView } from 'react-native';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, MessageCircle } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { MOCK_PANNEAU, MOCK_FIL_ACTUALITE, MOCK_CONVERSATIONS_V2 } from '@/fixtures/copro';
import { Avatar } from '@/components/ui/Avatar';
import { GradientCard } from '@/components/ui/GradientCard';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ListRow, RowSeparator } from '@/components/ui/ListRow';
import { PulsingDot } from '@/components/ui/PulsingDot';
import { TabSlideTransition } from '@/components/ui/TabSlideTransition';

type CoproTab = 'annonces' | 'messages';

function SegmentedTabs({
  active,
  onSwitch,
}: {
  active: CoproTab;
  onSwitch: (tab: CoproTab) => void;
}) {
  const colors = useThemeColors();
  const tabs: { key: CoproTab; label: string }[] = [
    { key: 'annonces', label: 'Annonces' },
    { key: 'messages', label: 'Messagerie' },
  ];
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

function AnnoncesTab() {
  const colors = useThemeColors();
  return (
    <YStack gap={24}>
      {/* Panneau d'affichage */}
      <YStack gap={12}>
        <SectionLabel marginBottom={0}>Panneau d'affichage</SectionLabel>
        {MOCK_PANNEAU.map((annonce) => (
          <YStack
            key={annonce.id}
            backgroundColor={colors.surface.card}
            borderRadius={24}
            padding={22}
            gap={10}
            pressStyle={{ scale: 0.98 }}
          >
            <XStack alignItems="center" gap={8}>
              <View
                paddingHorizontal={10}
                paddingVertical={4}
                borderRadius={999}
                backgroundColor={
                  annonce.badgeVariant === 'teal' ? colors.primary[50] : colors.secondary[50]
                }
              >
                <Text
                  fontFamily="$heading"
                  fontSize={11}
                  fontWeight="700"
                  color={
                    annonce.badgeVariant === 'teal' ? colors.primary[500] : colors.secondary[600]
                  }
                >
                  {annonce.badge}
                </Text>
              </View>
              <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.text.disabled}>
                {annonce.date}
              </Text>
            </XStack>
            <Text fontFamily="$heading" fontSize={16} fontWeight="700" color={colors.text.primary}>
              {annonce.title}
            </Text>
            <Text
              fontFamily="$body"
              fontSize={13}
              fontWeight="400"
              color={colors.text.muted}
              lineHeight={20}
            >
              {annonce.content}
            </Text>
          </YStack>
        ))}
      </YStack>

      {/* Fil d'actualité */}
      <YStack gap={4} paddingBottom={130}>
        <SectionLabel>Fil d'actualité</SectionLabel>
        {MOCK_FIL_ACTUALITE.map((item, index) => (
          <YStack key={item.id}>
            {index > 0 && <RowSeparator />}
            <ListRow paddingVertical={12} aria-label={item.title}>
              <View
                width={10}
                height={10}
                borderRadius={5}
                backgroundColor={item.color === 'info' ? colors.info : colors.primary[500]}
              />
              <YStack flex={1}>
                <Text fontFamily="$body" fontSize={15} fontWeight="600" color={colors.text.primary}>
                  {item.title}
                </Text>
                <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
                  {item.subtitle}
                </Text>
              </YStack>
            </ListRow>
          </YStack>
        ))}
      </YStack>
    </YStack>
  );
}

function MessagesTab() {
  const colors = useThemeColors();
  const handleOpenConversation = (name: string) => {
    Alert.alert(name, 'La conversation détaillée sera bientôt disponible.');
  };

  return (
    <YStack gap={20} paddingBottom={130}>
      {/* CTA gestionnaire : canal unique et traçable */}
      <GradientCard radius={24} padding={20}>
        <XStack
          alignItems="center"
          gap={14}
          onPress={() => handleOpenConversation('Cabinet Foncia')}
          pressStyle={{ opacity: 0.8 }}
          role="button"
          aria-label="Écrire au gestionnaire"
        >
          <View
            width={48}
            height={48}
            borderRadius={24}
            backgroundColor={colors.white}
            alignItems="center"
            justifyContent="center"
          >
            <MessageCircle size={22} color={colors.primary[500]} strokeWidth={1.8} />
          </View>
          <YStack flex={1}>
            <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.primary[900]}>
              Écrire au gestionnaire
            </Text>
            <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.primary[600]}>
              Canal unique et traçable · réponse sous 48h
            </Text>
          </YStack>
          <ChevronRight size={16} color={colors.primary[600]} strokeWidth={2} />
        </XStack>
      </GradientCard>

      {/* Conversations : syndic + gardien uniquement (pas de P2P en P0) */}
      <YStack>
        {MOCK_CONVERSATIONS_V2.map((conv, index) => {
          const hasUnread = conv.unread > 0;
          return (
            <YStack key={conv.id}>
              {index > 0 && <RowSeparator />}
              <ListRow
                onPress={() => handleOpenConversation(conv.name)}
                aria-label={`Conversation avec ${conv.name}`}
              >
                <Avatar
                  initials={conv.initials}
                  size={52}
                  variant={conv.gradient ? 'gradient' : 'soft'}
                />
                <YStack flex={1} gap={2} minWidth={0}>
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text
                      fontFamily="$heading"
                      fontSize={15}
                      fontWeight={hasUnread ? '700' : '600'}
                      color={colors.text.primary}
                    >
                      {conv.name}
                    </Text>
                    <Text
                      fontFamily="$body"
                      fontSize={12}
                      fontWeight={hasUnread ? '500' : '400'}
                      color={hasUnread ? colors.primary[500] : colors.text.disabled}
                    >
                      {conv.time}
                    </Text>
                  </XStack>
                  <Text
                    fontFamily="$body"
                    fontSize={13}
                    fontWeight={hasUnread ? '500' : '400'}
                    color={hasUnread ? colors.text.secondary : colors.text.muted}
                    numberOfLines={1}
                  >
                    {conv.message}
                  </Text>
                </YStack>
                {hasUnread && (
                  <View
                    minWidth={20}
                    height={20}
                    borderRadius={10}
                    backgroundColor={colors.primary[500]}
                    alignItems="center"
                    justifyContent="center"
                    paddingHorizontal={5}
                  >
                    <Text fontFamily="$heading" fontSize={11} fontWeight="700" color={colors.white}>
                      {conv.unread}
                    </Text>
                  </View>
                )}
              </ListRow>
            </YStack>
          );
        })}
      </YStack>
    </YStack>
  );
}

export default function CoproScreen() {
  const colors = useThemeColors();
  const [tab, setTab] = useState<CoproTab>('annonces');

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <TabSlideTransition>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 0 }}
            showsVerticalScrollIndicator={false}
          >
            <YStack paddingHorizontal={24} paddingTop={20} paddingBottom={16}>
              <Text
                fontFamily="$heading"
                fontSize={32}
                fontWeight="800"
                letterSpacing={-0.8}
                color={colors.text.primary}
                role="heading"
              >
                Copro
              </Text>
            </YStack>

            <YStack paddingHorizontal={24} gap={24}>
              <SegmentedTabs active={tab} onSwitch={setTab} />
              {tab === 'annonces' ? <AnnoncesTab /> : <MessagesTab />}
            </YStack>
          </ScrollView>
        </SafeAreaView>
      </TabSlideTransition>
    </RNView>
  );
}
