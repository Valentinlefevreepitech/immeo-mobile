import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Incident = Database['public']['Tables']['incidents']['Row'];
type IncidentInsert = Database['public']['Tables']['incidents']['Insert'];

export async function fetchMesSignalements(userId: string): Promise<Incident[]> {
  if (!supabase) throw new Error('Supabase non disponible');
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('created_by', userId)
    .order('reported_date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchIncidentsImmeuble(coproprieteId: string): Promise<Incident[]> {
  if (!supabase) throw new Error('Supabase non disponible');
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('copropriete_id', coproprieteId)
    .is('apartment_id', null)
    .order('reported_date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchIncidentById(id: string): Promise<Incident | null> {
  if (!supabase) throw new Error('Supabase non disponible');
  const { data, error } = await supabase.from('incidents').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchCoproprieteCabinetId(coproprieteId: string): Promise<string | null> {
  if (!supabase) throw new Error('Supabase non disponible');
  const { data, error } = await supabase
    .from('coproprietes')
    .select('cabinet_id')
    .eq('id', coproprieteId)
    .maybeSingle();
  if (error) throw error;
  return data?.cabinet_id ?? null;
}

export async function insertIncident(payload: IncidentInsert): Promise<Incident> {
  if (!supabase) throw new Error('Supabase non disponible');
  const { data, error } = await supabase.from('incidents').insert(payload).select().single();
  if (error) throw error;
  return data;
}
