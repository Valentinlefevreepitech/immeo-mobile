import { memo } from 'react';
import { Alert } from 'react-native';
import { YStack, XStack, Text, View } from 'tamagui';
import { FileText, ClipboardList, ShieldCheck, Receipt, File, Download } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const DOC_ICONS: Record<string, React.ReactNode> = {
  bail: <FileText size={20} color={colors.primary[500]} />,
  etat_des_lieux: <ClipboardList size={20} color={colors.primary[500]} />,
  assurance: <ShieldCheck size={20} color={colors.primary[500]} />,
  quittance: <Receipt size={20} color={colors.primary[500]} />,
};

interface DocumentRowProps {
  name: string;
  type: string;
  date: string;
}

export const DocumentRow = memo(function DocumentRow({ name, type, date }: DocumentRowProps) {
  function handlePress() {
    Alert.alert(
      name,
      `Type : ${type}\n${date}\n\nLe telechargement de documents sera bientot disponible.`,
    );
  }

  return (
    <View
      paddingVertical={12}
      pressStyle={{ opacity: 0.7 }}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Document : ${name}, ${date}`}
      accessibilityHint="Double-tapez pour telecharger le document"
    >
      <XStack gap={14} alignItems="center">
        <View
          width={40}
          height={40}
          borderRadius={10}
          backgroundColor={colors.primary[50]}
          alignItems="center"
          justifyContent="center"
        >
          {DOC_ICONS[type] || <File size={20} color={colors.primary[500]} />}
        </View>
        <YStack flex={1} gap={2}>
          <Text fontFamily="$body" fontSize={14} fontWeight="500" color={colors.gray[900]}>
            {name}
          </Text>
          <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.gray[400]}>
            {date}
          </Text>
        </YStack>
        <Download size={20} color={colors.gray[400]} />
      </XStack>
    </View>
  );
});
