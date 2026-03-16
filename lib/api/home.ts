import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Copropriete = Database['public']['Tables']['coproprietes']['Row'];
type Caretaker = Database['public']['Tables']['caretakers']['Row'];
type ImportantDate = Database['public']['Tables']['important_dates']['Row'];
type MonitoringAlert = Database['public']['Tables']['monitoring_alerts']['Row'];

export async function fetchCopropriete(coproprieteId: string): Promise<Copropriete> {
  if (!supabase) throw new Error('Supabase non disponible');
  const { data, error } = await supabase
    .from('coproprietes')
    .select('*')
    .eq('id', coproprieteId)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchCaretaker(coproprieteId: string): Promise<Caretaker | null> {
  if (!supabase) throw new Error('Supabase non disponible');
  const { data, error } = await supabase
    .from('caretakers')
    .select('*')
    .eq('copropriete_id', coproprieteId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function fetchImportantDates(coproprieteId: string): Promise<ImportantDate[]> {
  if (!supabase) throw new Error('Supabase non disponible');
  const { data, error } = await supabase
    .from('important_dates')
    .select('*')
    .eq('copropriete_id', coproprieteId)
    .order('date', { ascending: true });
  if (error) throw error;
  return data;
}

export async function fetchActiveAlerts(): Promise<MonitoringAlert[]> {
  if (!supabase) throw new Error('Supabase non disponible');
  const { data, error } = await supabase
    .from('monitoring_alerts')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
