import { Platform } from 'react-native';
import { supabase } from './supabase';

/**
 * Upload an incident photo to Supabase Storage.
 * Returns the public URL of the uploaded file.
 */
export async function uploadIncidentPhoto(uri: string, incidentId: string): Promise<string> {
  if (!supabase) throw new Error('Supabase non disponible');

  const ext = uri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const fileName = `${incidentId}/${Date.now()}.${ext}`;

  const formData = new FormData();
  formData.append('file', {
    uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
    name: fileName,
    type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
  } as unknown as Blob);

  const { error } = await supabase.storage.from('incident-photos').upload(fileName, formData, {
    contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    upsert: false,
  });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from('incident-photos').getPublicUrl(fileName);

  return publicUrl;
}

/**
 * Upload a profile avatar to Supabase Storage.
 * Returns the public URL of the uploaded file.
 */
export async function uploadProfileAvatar(uri: string, userId: string): Promise<string> {
  if (!supabase) throw new Error('Supabase non disponible');

  const ext = uri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const fileName = `${userId}/avatar.${ext}`;

  const formData = new FormData();
  formData.append('file', {
    uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
    name: fileName,
    type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
  } as unknown as Blob);

  const { error } = await supabase.storage.from('avatars').upload(fileName, formData, {
    contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    upsert: true,
  });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(fileName);

  return publicUrl;
}

/**
 * Get a signed download URL for a document in Supabase Storage.
 * The URL is valid for 1 hour (3600 seconds).
 */
export async function getDocumentUrl(filePath: string): Promise<string> {
  if (!supabase) throw new Error('Supabase non disponible');

  const { data, error } = await supabase.storage.from('documents').createSignedUrl(filePath, 3600);

  if (error) throw error;

  return data.signedUrl;
}
