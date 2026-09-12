import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import {
  fetchApartment,
  fetchParkingSpaces,
  fetchRentPayments,
  fetchApartmentDocuments,
  fetchTenants,
  fetchAppelsDeFonds,
} from '@/lib/api/apartment';
import {
  MOCK_APARTMENT,
  MOCK_PARKING,
  MOCK_LOYER,
  MOCK_PAYMENTS,
  MOCK_DOCUMENTS,
  MOCK_OCCUPANTS,
  MOCK_FINANCES,
  MOCK_LOGEMENT,
  type FinanceContent,
  type FinanceRow,
} from '@/fixtures/apartment';

function formatPaymentStatus(status: string): 'paye' | 'en_attente' {
  if (status === 'paye') return 'paye';
  return 'en_attente';
}

function formatMonth(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

function buildLocataireFinance(
  aptData: { loyer: number | null; charges: number | null } | undefined,
  paymentsData: {
    id: string;
    montant_total: number | null;
    montant_loyer: number;
    montant_charges: number;
    status: string;
    periode_debut: string;
    date_paiement: string | null;
    date_echeance: string;
  }[],
): FinanceContent {
  if (!aptData) return MOCK_FINANCES.locataire;

  const loyer = aptData.loyer ?? 0;
  const charges = aptData.charges ?? 0;
  const total = loyer + charges;

  const rows: FinanceRow[] = paymentsData.slice(0, 2).map((p) => {
    const montant = p.montant_total ?? p.montant_loyer + p.montant_charges;
    const paid = p.status === 'paye';
    return {
      id: p.id,
      title: formatMonth(p.periode_debut).replace(/^./, (c) => c.toUpperCase()),
      subtitle: paid ? `Payé le ${p.date_paiement ?? ''}` : `À venir · échéance ${p.date_echeance}`,
      amount: `${montant} €`,
      status: paid ? 'paid' : 'upcoming',
    };
  });

  return {
    title: 'Loyer mensuel',
    amount: `${total} €`,
    suffix: '/ mois',
    detail: `${loyer} € de loyer + ${charges} € de charges`,
    badge: paymentsData[0]
      ? `Prochain prélèvement le ${paymentsData[0].date_echeance}`
      : MOCK_FINANCES.locataire.badge,
    histTitle: 'Paiements',
    rows: rows.length > 0 ? rows : MOCK_FINANCES.locataire.rows,
  };
}

function buildCoproprietaireFinance(
  appelsData: {
    id: string;
    montant_appele: number | null;
    statut: string | null;
    libelle: string | null;
    trimestre: number | null;
    annee: number | null;
    date_echeance: string | null;
    date_paiement: string | null;
  }[],
): FinanceContent {
  if (appelsData.length === 0) return MOCK_FINANCES.coproprietaire;

  const rows: FinanceRow[] = appelsData.slice(0, 2).map((a) => {
    const paid = a.statut === 'paye';
    return {
      id: a.id,
      title: a.libelle ?? `Appel T${a.trimestre ?? '?'} ${a.annee ?? ''}`,
      subtitle: paid
        ? `Payé le ${a.date_paiement ?? ''}`
        : `À venir · exigible ${a.date_echeance ?? ''}`,
      amount: `${a.montant_appele ?? 0} €`,
      status: paid ? 'paid' : 'upcoming',
    };
  });

  const current = appelsData[0];
  return {
    title: 'Appels de fonds',
    amount: `${current.montant_appele ?? 0} €`,
    suffix: current.statut === 'paye' ? 'payé' : 'à venir',
    detail: `${current.libelle ?? 'Appel de fonds'} · exigible ${current.date_echeance ?? ''}`,
    badge: MOCK_FINANCES.coproprietaire.badge,
    histTitle: 'Appels de fonds',
    rows,
  };
}

export function useApartment() {
  const apartmentId = useAuthStore((s) => s.user?.apartmentId);
  const coproprietaireId = useAuthStore((s) => s.user?.coproprietaireId);
  const role = useAuthStore((s) => s.user?.role);
  const effectiveRole = role === 'gestionnaire' ? 'locataire' : (role ?? 'locataire');

  const apartmentQuery = useQuery({
    queryKey: ['apartment', apartmentId],
    queryFn: () => fetchApartment(apartmentId!),
    enabled: !!apartmentId,
  });

  const parkingQuery = useQuery({
    queryKey: ['parking_spaces', apartmentId],
    queryFn: () => fetchParkingSpaces(apartmentId!),
    enabled: !!apartmentId,
  });

  const paymentsQuery = useQuery({
    queryKey: ['rent_payments', apartmentId],
    queryFn: () => fetchRentPayments(apartmentId!),
    enabled: !!apartmentId,
  });

  const documentsQuery = useQuery({
    queryKey: ['apartment_documents', apartmentId],
    queryFn: () => fetchApartmentDocuments(apartmentId!),
    enabled: !!apartmentId,
  });

  const tenantsQuery = useQuery({
    queryKey: ['tenants', apartmentId],
    queryFn: () => fetchTenants(apartmentId!),
    enabled: !!apartmentId,
  });

  const appelsQuery = useQuery({
    queryKey: ['appels_de_fonds', coproprietaireId],
    queryFn: () => fetchAppelsDeFonds(coproprietaireId!),
    enabled: !!coproprietaireId,
  });

  const aptData = apartmentQuery.data;
  const parkingData = parkingQuery.data;
  const paymentsData = paymentsQuery.data;
  const documentsData = documentsQuery.data;
  const tenantsData = tenantsQuery.data;
  const appelsData = appelsQuery.data;

  // Map to the shape screens expect, falling back to fixtures
  const apartment = aptData
    ? {
        numero: aptData.numero,
        etage: aptData.etage != null ? `${aptData.etage}eme` : '',
        surface:
          aptData.surface != null
            ? `${aptData.surface} m²`
            : aptData.superficie != null
              ? `${aptData.superficie} m²`
              : '',
        pieces:
          aptData.nombre_pieces != null
            ? `${aptData.nombre_pieces} (T${aptData.nombre_pieces})`
            : '',
        type: aptData.type_lot ?? 'Appartement',
      }
    : MOCK_APARTMENT;

  const firstParking = parkingData?.[0];
  const parking = firstParking
    ? {
        numero: firstParking.numero,
        niveau: firstParking.niveau ?? '',
        type: firstParking.type_place ?? 'Interieur',
      }
    : MOCK_PARKING;

  const loyer = aptData
    ? {
        loyer: aptData.loyer ?? 0,
        charges: aptData.charges ?? 0,
        total: (aptData.loyer ?? 0) + (aptData.charges ?? 0),
      }
    : MOCK_LOYER;

  const payments =
    paymentsData && paymentsData.length > 0
      ? paymentsData.map((p) => ({
          id: p.id,
          month: formatMonth(p.periode_debut),
          amount: `${p.montant_total ?? p.montant_loyer + p.montant_charges} \u20AC`,
          status: formatPaymentStatus(p.status),
          detail: [
            `Montant : ${p.montant_total ?? p.montant_loyer + p.montant_charges} \u20AC`,
            `Statut : ${p.status === 'paye' ? 'Paye' : 'En attente'}`,
            p.date_paiement
              ? `Date de paiement : ${p.date_paiement}`
              : `Echeance : ${p.date_echeance}`,
          ].join('\n'),
        }))
      : MOCK_PAYMENTS;

  const documents =
    documentsData && documentsData.length > 0
      ? documentsData.map((d) => ({
          name: d.file_name,
          type: d.type,
          date: d.date_document ?? d.uploaded_at ?? '',
        }))
      : MOCK_DOCUMENTS;

  const occupants =
    tenantsData && tenantsData.length > 0
      ? tenantsData.map((t) => {
          const fullName = [t.first_name, t.last_name].filter(Boolean).join(' ');
          const initials = fullName
            .split(' ')
            .map((s) => s[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
          return {
            name: fullName,
            initials,
            isPrincipal: t.is_main_tenant ?? false,
            phone: t.phone ?? undefined,
          };
        })
      : MOCK_OCCUPANTS;

  const finance: FinanceContent =
    effectiveRole === 'coproprietaire'
      ? buildCoproprietaireFinance(appelsData ?? [])
      : buildLocataireFinance(aptData, paymentsData ?? []);

  const logement = aptData
    ? [
        {
          id: 'surface',
          value: apartment.surface || '—',
          label: `Surface${aptData.type_lot ? ` · ${aptData.type_lot}` : ''}`,
        },
        { id: 'etage', value: apartment.etage || '—', label: `Étage · ${aptData.numero ?? ''}` },
        ...(firstParking
          ? [
              {
                id: 'parking',
                value: `N°${firstParking.numero}`,
                label: `Parking · ${firstParking.niveau ?? ''}`,
              },
            ]
          : []),
      ]
    : MOCK_LOGEMENT;

  const isLoading =
    apartmentQuery.isLoading ||
    parkingQuery.isLoading ||
    paymentsQuery.isLoading ||
    documentsQuery.isLoading ||
    tenantsQuery.isLoading ||
    appelsQuery.isLoading;

  const error =
    apartmentQuery.error ||
    parkingQuery.error ||
    paymentsQuery.error ||
    documentsQuery.error ||
    tenantsQuery.error ||
    appelsQuery.error;

  return {
    apartment,
    parking,
    loyer,
    payments,
    documents,
    occupants,
    finance,
    logement,
    isLoading,
    error,
  };
}
