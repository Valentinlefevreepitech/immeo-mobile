import { YStack, XStack, Text, View } from 'tamagui';
import { BarChart3 } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface SondageCardProps {
  question: string;
  options: { label: string; votes: number }[];
  totalVotes: number;
  endsAt: string;
  hasVoted: boolean;
  onVote: (index: number) => void;
}

export function SondageCard({
  question,
  options,
  totalVotes,
  endsAt,
  hasVoted,
  onVote,
}: SondageCardProps) {
  return (
    <View
      backgroundColor={colors.white}
      borderRadius={16}
      padding={20}
      gap={16}
      accessibilityLabel={`Sondage : ${question}, ${totalVotes} votes`}
    >
      <YStack gap={4}>
        <XStack gap={8} alignItems="center">
          <BarChart3 size={16} color={colors.primary[500]} />
          <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.gray[900]}>
            {question}
          </Text>
        </XStack>
        <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.gray[400]}>
          {totalVotes} votes · {hasVoted ? 'Vous avez vote' : `Termine le ${endsAt}`}
        </Text>
      </YStack>

      <YStack gap={10}>
        {options.map((option, index) => {
          const pct = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          return (
            <View
              key={option.label}
              pressStyle={!hasVoted ? { opacity: 0.7 } : undefined}
              onPress={() => onVote(index)}
              accessibilityRole="button"
              accessibilityLabel={`${option.label}, ${pct} pour cent`}
              accessibilityHint={hasVoted ? undefined : 'Double-tapez pour voter'}
              accessibilityState={{ disabled: hasVoted }}
            >
              <YStack gap={4}>
                <XStack justifyContent="space-between">
                  <Text fontFamily="$body" fontSize={13} fontWeight="500" color={colors.gray[700]}>
                    {option.label}
                  </Text>
                  <Text
                    fontFamily="$body"
                    fontSize={13}
                    fontWeight="600"
                    color={colors.primary[500]}
                  >
                    {pct}%
                  </Text>
                </XStack>
                <View height={8} borderRadius={4} backgroundColor={colors.gray[100]}>
                  <View
                    height={8}
                    borderRadius={4}
                    backgroundColor={colors.primary[500]}
                    width={`${pct}%`}
                  />
                </View>
              </YStack>
            </View>
          );
        })}
      </YStack>
      {!hasVoted && (
        <Text
          fontFamily="$body"
          fontSize={12}
          fontWeight="400"
          color={colors.gray[400]}
          textAlign="center"
        >
          Appuyez sur une option pour voter
        </Text>
      )}
    </View>
  );
}
