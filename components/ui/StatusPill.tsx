import { Text, View } from 'tamagui';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { IncidentStatusV2 } from '@/fixtures/incidents';

type Colors = ReturnType<typeof useThemeColors>;

function getStatusConfig(
  colors: Colors,
): Record<IncidentStatusV2, { label: string; bg: string; fg: string }> {
  return {
    declare: { label: 'Déclaré', bg: colors.warningBg, fg: colors.warning },
    pris_en_compte: { label: 'Pris en compte', bg: colors.primary[50], fg: colors.primary[500] },
    intervention: { label: 'Intervention', bg: colors.infoBg, fg: colors.info },
    resolu: { label: 'Résolu', bg: colors.successBg, fg: colors.successDark },
    en_cours: { label: 'En cours', bg: colors.infoBg, fg: colors.info },
  };
}

/** Couleur du dot de statut (listes d'incidents). */
export function statusDotColor(status: IncidentStatusV2, colors: Colors): string {
  switch (status) {
    case 'declare':
      return colors.warning;
    case 'resolu':
      return colors.success;
    case 'pris_en_compte':
      return colors.primary[500];
    default:
      return colors.info;
  }
}

/** Badge pill de statut d'incident (prototype v2). */
export function StatusPill({ status }: { status: IncidentStatusV2 }) {
  const colors = useThemeColors();
  const config = getStatusConfig(colors)[status];
  return (
    <View
      paddingHorizontal={12}
      paddingVertical={5}
      borderRadius={999}
      backgroundColor={config.bg}
      aria-label={`Statut : ${config.label}`}
    >
      <Text fontFamily="$body" fontSize={12} fontWeight="600" color={config.fg}>
        {config.label}
      </Text>
    </View>
  );
}
