import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Apartment = Database['public']['Tables']['apartments']['Row'];
type ParkingSpace = Database['public']['Tables']['parking_spaces']['Row'];
type RentPayment = Database['public']['Tables']['rent_payments']['Row'];
type ApartmentDocument = Database['public']['Tables']['apartment_documents']['Row'];
type Tenant = Database['public']['Tables']['tenants']['Row'];

export async function fetchApartment(apartmentId: string): Promise<Apartment> {
  if (!supabase) throw new Error('Supabase non disponible');
  const { data, error } = await supabase
    .from('apartments')
    .select('*')
    .eq('id', apartmentId)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchParkingSpaces(apartmentId: string): Promise<ParkingSpace[]> {
  if (!supabase) throw new Error('Supabase non disponible');
  const { data, error } = await supabase
    .from('parking_spaces')
    .select('*')
    .eq('apartment_id', apartmentId);
  if (error) throw error;
  return data;
}

export async function fetchRentPayments(apartmentId: string): Promise<RentPayment[]> {
  if (!supabase) throw new Error('Supabase non disponible');
  const { data, error } = await supabase
    .from('rent_payments')
    .select('*')
    .eq('apartment_id', apartmentId)
    .order('date_echeance', { ascending: false })
    .limit(12);
  if (error) throw error;
  return data;
}

export async function fetchApartmentDocuments(apartmentId: string): Promise<ApartmentDocument[]> {
  if (!supabase) throw new Error('Supabase non disponible');
  const { data, error } = await supabase
    .from('apartment_documents')
    .select('*')
    .eq('apartment_id', apartmentId)
    .order('uploaded_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchTenants(apartmentId: string): Promise<Tenant[]> {
  if (!supabase) throw new Error('Supabase non disponible');
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('apartment_id', apartmentId)
    .is('date_sortie', null)
    .order('is_main_tenant', { ascending: false });
  if (error) throw error;
  return data;
}
