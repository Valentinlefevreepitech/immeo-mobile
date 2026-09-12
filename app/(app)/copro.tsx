import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, View as RNView } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart3, Check, ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useSondages } from '@/hooks/useSondages';
import type { Sondage, SondageOption } from '@/fixtures/sondages';
import { MOCK_PANNEAU, MOCK_FIL_ACTUALITE } from '@/fixtures/copro';
import { Avatar } from '@/components/ui/Avatar';
import { GradientCard } from '@/components/ui/GradientCard';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ListRow, RowSeparator } from '@/components/ui/ListRow';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { TabSlideTransition } from '@/components/ui/TabSlideTransition';

type CoproTab = 'annonces' | 'sondages';

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

/** Row votable d'une option de sondage : dot + label, barre+% une fois voté. */
function PollOptionRow({
  option,
  totalVotes,
  selected,
  hasVoted,
  onPress,
}: {
  option: SondageOption;
  totalVotes: number;
  selected: boolean;
  hasVoted: boolean;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  const pct = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: hasVoted ? 1 : 0,
      duration: 450,
      useNativeDriver: false,
    }).start();
  }, [hasVoted, pct, anim]);

  return (
    <YStack
      backgroundColor={selected ? colors.primary[50] : colors.surface.page}
      borderWidth={1.5}
      borderColor={selected ? colors.primary[200] : colors.surface.separator}
      borderRadius={16}
      padding={14}
      gap={8}
      onPress={(e: { stopPropagation?: () => void }) => {
        e?.stopPropagation?.();
        onPress();
      }}
      pressStyle={{ scale: 0.99 }}
      role="radio"
      aria-label={option.label}
      aria-selected={selected}
    >
      <XStack alignItems="center" gap={10}>
        <View
          width={20}
          height={20}
          borderRadius={10}
          borderWidth={1.5}
          borderColor={selected ? colors.primary[500] : colors.surface.empty}
          backgroundColor={selected ? colors.primary[500] : 'transparent'}
          alignItems="center"
          justifyContent="center"
        >
          {selected && <Check size={12} color={colors.white} strokeWidth={3} />}
        </View>
        <Text
          flex={1}
          fontFamily="$body"
          fontSize={14}
          fontWeight={selected ? '700' : '500'}
          color={colors.text.primary}
        >
          {option.label}
        </Text>
        {hasVoted && (
          <Animated.Text
            style={{
              opacity: anim,
              fontFamily: 'InterBold',
              fontSize: 13,
              color: selected ? colors.primary[500] : colors.text.muted,
            }}
          >
            {pct}%
          </Animated.Text>
        )}
      </XStack>
      {hasVoted && (
        <Animated.View
          style={{
            opacity: anim,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.surface.empty,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={{
              height: 8,
              borderRadius: 4,
              backgroundColor: selected ? colors.primary[500] : colors.primary[200],
              width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', `${pct}%`] }),
            }}
          />
        </Animated.View>
      )}
    </YStack>
  );
}

function winningOption(sondage: Sondage): { label: string; pct: number } {
  const total = sondage.options.reduce((sum, o) => sum + o.votes, 0);
  const winner = sondage.options.reduce((best, o) => (o.votes > best.votes ? o : best));
  return { label: winner.label, pct: total > 0 ? Math.round((winner.votes / total) * 100) : 0 };
}

function SondagesTab() {
  const colors = useThemeColors();
  const router = useRouter();
  const { active, passes, totalVotes, vote } = useSondages();

  return (
    <YStack gap={24} paddingBottom={130}>
      {/* CTA lancer un sondage */}
      <GradientCard radius={24} padding={20}>
        <XStack
          alignItems="center"
          gap={14}
          onPress={() => router.push('/sondage-creer')}
          pressStyle={{ opacity: 0.8 }}
          role="button"
          aria-label="Lancer un sondage"
        >
          <View
            width={48}
            height={48}
            borderRadius={24}
            backgroundColor={colors.white}
            alignItems="center"
            justifyContent="center"
          >
            <BarChart3 size={22} color={colors.primary[500]} strokeWidth={1.8} />
          </View>
          <YStack flex={1}>
            <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.primary[900]}>
              Lancer un sondage
            </Text>
            <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.primary[600]}>
              Consultez vos voisins en 2 questions
            </Text>
          </YStack>
          <ChevronRight size={16} color={colors.primary[600]} strokeWidth={2} />
        </XStack>
      </GradientCard>

      {/* Sondage actif */}
      {active && (
        <YStack
          backgroundColor={colors.surface.card}
          borderRadius={24}
          padding={20}
          gap={16}
          onPress={() => router.push('/sondage-detail')}
          pressStyle={{ scale: 0.995 }}
          role="button"
          aria-label={`Voir le détail du sondage : ${active.question}`}
        >
          <XStack alignItems="center" gap={10}>
            <Avatar initials={active.auteur.initials} size={36} variant="soft" />
            <YStack flex={1}>
              <Text
                fontFamily="$heading"
                fontSize={13}
                fontWeight="700"
                color={colors.text.primary}
              >
                {active.auteur.nom} · {active.auteur.etage}
              </Text>
              <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.text.muted}>
                Sondage entre voisins · {active.clotureLabel}
              </Text>
            </YStack>
            <View
              paddingHorizontal={10}
              paddingVertical={4}
              borderRadius={999}
              backgroundColor={colors.primary[50]}
            >
              <Text
                fontFamily="$heading"
                fontSize={11}
                fontWeight="700"
                color={colors.primary[500]}
              >
                {totalVotes} votes
              </Text>
            </View>
          </XStack>

          <Text fontFamily="$heading" fontSize={17} fontWeight="700" color={colors.text.primary}>
            {active.question}
          </Text>

          <YStack gap={8}>
            {active.options.map((opt) => (
              <PollOptionRow
                key={opt.id}
                option={opt}
                totalVotes={totalVotes}
                selected={active.monVote === opt.id}
                hasVoted={!!active.monVote}
                onPress={() => vote(opt.id)}
              />
            ))}
          </YStack>

          <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.text.muted}>
            {active.monVote
              ? "Merci ! Vous pouvez changer votre réponse jusqu'à la clôture."
              : 'Touchez une réponse pour voter'}
          </Text>
        </YStack>
      )}

      {/* Sondages passés */}
      <YStack gap={4}>
        <SectionLabel>Sondages passés</SectionLabel>
        {passes.map((sondage, index) => {
          const winner = winningOption(sondage);
          return (
            <YStack key={sondage.id}>
              {index > 0 && <RowSeparator />}
              <ListRow aria-label={sondage.question}>
                <YStack flex={1}>
                  <Text
                    fontFamily="$body"
                    fontSize={15}
                    fontWeight="600"
                    color={colors.text.primary}
                  >
                    {sondage.question}
                  </Text>
                  <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
                    {winner.label} · {winner.pct}%
                  </Text>
                </YStack>
                <View
                  paddingHorizontal={10}
                  paddingVertical={4}
                  borderRadius={999}
                  backgroundColor={colors.surface.empty}
                >
                  <Text fontFamily="$body" fontSize={11} fontWeight="600" color={colors.text.muted}>
                    Clos
                  </Text>
                </View>
              </ListRow>
            </YStack>
          );
        })}
      </YStack>

      <Text
        fontFamily="$body"
        fontSize={12}
        fontWeight="400"
        color={colors.text.muted}
        paddingHorizontal={8}
        lineHeight={18}
      >
        Sondages informels entre voisins, sans valeur de vote en AG. Le syndic peut en épingler un
        dans les annonces.
      </Text>
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
              <SegmentedTabs
                tabs={[
                  { key: 'annonces', label: 'Annonces' },
                  { key: 'sondages', label: 'Sondages' },
                ]}
                active={tab}
                onSwitch={(key) => setTab(key as CoproTab)}
              />
              {tab === 'annonces' ? <AnnoncesTab /> : <SondagesTab />}
            </YStack>
          </ScrollView>
        </SafeAreaView>
      </TabSlideTransition>
    </RNView>
  );
}
