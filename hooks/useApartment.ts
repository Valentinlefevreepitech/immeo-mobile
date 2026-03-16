import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import {
  fetchApartment,
  fetchParkingSpaces,
  fetchRentPayments,
  fetchApartmentDocuments,
  fetchTenants,
} from '@/lib/api/apartment';
import {
  MOCK_APARTMENT,
  MOCK_PARKING,
  MOCK_LOYER,
  MOCK_PAYMENTS,
  MOCK_DOCUMENTS,
  MOCK_OCCUPANTS,
} from '@/fixtures/apartment';

function formatPaymentStatus(status: string): 'paye' | 'en_attente' {
  if (status === 'paye') return 'paye';
  return 'en_attente';
}

function formatMonth(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

export function useApartment() {
  const apartmentId = useAuthStore((s) => s.user?.apartmentId);

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

  const aptData = apartmentQuery.data;
  const parkingData = parkingQuery.data;
  const paymentsData = paymentsQuery.data;
  const documentsData = documentsQuery.data;
  const tenantsData = tenantsQuery.data;

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

  const isLoading =
    apartmentQuery.isLoading ||
    parkingQuery.isLoading ||
    paymentsQuery.isLoading ||
    documentsQuery.isLoading ||
    tenantsQuery.isLoading;

  const error =
    apartmentQuery.error ||
    parkingQuery.error ||
    paymentsQuery.error ||
    documentsQuery.error ||
    tenantsQuery.error;

  return { apartment, parking, loyer, payments, documents, occupants, isLoading, error };
}
