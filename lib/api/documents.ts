import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type TenantDocument = Database['public']['Tables']['tenant_documents']['Row'];
type DocumentRow = Database['public']['Tables']['documents']['Row'];

export async function fetchTenantDocuments(tenantId: string): Promise<TenantDocument[]> {
  if (!supabase) throw new Error('Supabase non disponible');
  const { data, error } = await supabase
    .from('tenant_documents')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('uploaded_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchCoproprieteDocuments(coproprieteId: string): Promise<DocumentRow[]> {
  if (!supabase) throw new Error('Supabase non disponible');
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('copropriete_id', coproprieteId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getSignedDocumentUrl(filePath: string): Promise<string> {
  if (!supabase) throw new Error('Supabase non disponible');
  const { data, error } = await supabase.storage
    .from('tenant-documents')
    .createSignedUrl(filePath, 60);
  if (error) throw error;
  return data.signedUrl;
}
