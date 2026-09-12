import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import {
  fetchTenantDocuments,
  fetchCoproprieteDocuments,
  getSignedDocumentUrl,
} from '@/lib/api/documents';
import {
  MOCK_DOCS_ALERTE,
  MOCK_DOCS_COPRO,
  getDocsLot,
  type MockDocument,
} from '@/fixtures/documents';
import type { Database } from '@/types/database';

type TenantDocumentRow = Database['public']['Tables']['tenant_documents']['Row'];

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  bail: 'Bail de location',
  etat_lieux_entree: "État des lieux d'entrée",
  etat_lieux_sortie: 'État des lieux de sortie',
  assurance: "Attestation d'assurance",
  identite: "Pièce d'identité",
  rib: 'RIB',
  avis_imposition: "Avis d'imposition",
  justificatif_revenus: 'Justificatif de revenus',
  contrat_travail: 'Contrat de travail',
  garant_identite: "Pièce d'identité du garant",
  garant_revenus: 'Justificatif de revenus du garant',
  garant_avis_imposition: "Avis d'imposition du garant",
};

function labelFor(type: string): string {
  return DOCUMENT_TYPE_LABELS[type] ?? type;
}

function formatDateFr(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function toMockDocument(row: TenantDocumentRow): MockDocument {
  return {
    id: row.id,
    title: labelFor(row.type),
    subtitle: row.uploaded_at ? formatDateFr(row.uploaded_at) : '',
    action: 'download',
    filePath: row.file_path,
  };
}

function buildAssuranceAlerte(tenantDocs: TenantDocumentRow[]): typeof MOCK_DOCS_ALERTE | null {
  const assurance = tenantDocs.find((d) => d.type === 'assurance');

  if (!assurance) {
    return { text: "Aucune attestation d'assurance déposée", action: 'Déposer' };
  }

  if (!assurance.expiry_date) {
    return null;
  }

  const expiry = new Date(assurance.expiry_date);
  const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (daysLeft > 60) {
    return null;
  }

  return {
    text: `Attestation d'assurance à renouveler avant le ${formatDateFr(assurance.expiry_date)}`,
    action: 'Déposer',
  };
}

export function useDocuments() {
  const role = useAuthStore((s) => s.user?.role);
  const tenantId = useAuthStore((s) => s.user?.tenantId);
  const coproprieteId = useAuthStore((s) => s.user?.coproprieteId);

  const tenantDocsQuery = useQuery({
    queryKey: ['tenant_documents', tenantId],
    queryFn: () => fetchTenantDocuments(tenantId!),
    enabled: !!tenantId,
  });

  const coproDocsQuery = useQuery({
    queryKey: ['documents', coproprieteId],
    queryFn: () => fetchCoproprieteDocuments(coproprieteId!),
    enabled: !!coproprieteId,
  });

  const effectiveRole = role === 'gestionnaire' ? 'locataire' : (role ?? 'locataire');

  const docsLot =
    effectiveRole === 'locataire' && tenantDocsQuery.data && tenantDocsQuery.data.length > 0
      ? { section: 'Mon logement (bail)', items: tenantDocsQuery.data.map(toMockDocument) }
      : getDocsLot(effectiveRole);

  const docsCopro =
    coproDocsQuery.data && coproDocsQuery.data.length > 0
      ? coproDocsQuery.data.map(
          (row): MockDocument => ({
            id: row.id,
            title: row.nom,
            subtitle: row.date_document ? formatDateFr(row.date_document) : '',
            action: 'download',
            url: row.file_url,
          }),
        )
      : MOCK_DOCS_COPRO;

  const alerte = tenantDocsQuery.data
    ? buildAssuranceAlerte(tenantDocsQuery.data)
    : MOCK_DOCS_ALERTE;

  return {
    docsLot,
    docsCopro,
    alerte,
    isLoading: tenantDocsQuery.isLoading || coproDocsQuery.isLoading,
    error: tenantDocsQuery.error || coproDocsQuery.error,
  };
}

export async function getDownloadUrl(doc: MockDocument): Promise<string | null> {
  if (doc.url) return doc.url;
  if (doc.filePath) return getSignedDocumentUrl(doc.filePath);
  return null;
}
