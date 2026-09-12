import type { ResidentRole } from '@/stores/roleStore';

export interface MockDocument {
  id: string;
  title: string;
  subtitle: string;
  action?: 'download' | 'chevron';
  /** Chemin de stockage prive (tenant-documents) : necessite une URL signee. */
  filePath?: string;
  /** URL publique deja utilisable directement (documents copropriete). */
  url?: string;
}

export const MOCK_DOCS_ALERTE = {
  text: "Attestation d'assurance à renouveler avant le 1 sept.",
  action: 'Déposer',
};

export function getDocsLot(role: ResidentRole): { section: string; items: MockDocument[] } {
  const locataire = role === 'locataire';
  return {
    section: locataire ? 'Mon logement (bail)' : 'Mon lot',
    items: [
      {
        id: 'doc-principal',
        title: locataire ? 'Bail de location' : 'Attestation de propriété',
        subtitle: 'Signé le 1 sept. 2024',
        action: 'download',
      },
      {
        id: 'etat-des-lieux',
        title: "État des lieux d'entrée",
        subtitle: '1 sept. 2024',
        action: 'download',
      },
      {
        id: 'quittance',
        title: locataire ? 'Quittance février 2026' : 'Régularisation charges 2025',
        subtitle: '1 mars 2026',
        action: 'download',
      },
    ],
  };
}

export const MOCK_DOCS_COPRO: MockDocument[] = [
  {
    id: 'reglement',
    title: 'Règlement de copropriété',
    subtitle: 'Mis à jour le 10 mars 2026',
    action: 'download',
  },
  {
    id: 'pv-ag',
    title: 'PV des assemblées générales',
    subtitle: '3 documents',
    action: 'chevron',
  },
];
