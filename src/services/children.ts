import { supabase } from '../lib/supabase';
import type { Child } from '../types/app.types';
import type { TablesInsert, TablesUpdate } from '../types/database.types';
import type { ServiceResult } from '../types/result';
import { fail, fromError, ok } from '../types/result';
import { pickAllowedChildUpdate } from '../utils/childUpdate';

export async function listChildren(
  familyId: string
): Promise<ServiceResult<Child[]>> {
  try {
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: true });
    if (error) return fail(error.message);
    return ok(data ?? []);
  } catch (e) {
    return fromError(e);
  }
}

export async function getChild(
  id: string
): Promise<ServiceResult<Child | null>> {
  try {
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) return fail(error.message);
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

export async function createChild(
  input: TablesInsert<'children'>
): Promise<ServiceResult<Child>> {
  try {
    const { data, error } = await supabase
      .from('children')
      .insert(input)
      .select('*')
      .single();
    if (error) return fail(error.message);
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

export async function updateChild(
  id: string,
  patch: TablesUpdate<'children'>
): Promise<ServiceResult<Child>> {
  try {
    // Defense-in-depth: only allow client-writable columns through. Points,
    // streaks, and identity columns change exclusively via the RPCs (and are
    // revoked at the DB grant layer in migration 017).
    const { data, error } = await supabase
      .from('children')
      .update(pickAllowedChildUpdate(patch))
      .eq('id', id)
      .select('*')
      .single();
    if (error) return fail(error.message);
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

export async function deleteChild(id: string): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase.from('children').delete().eq('id', id);
    if (error) return fail(error.message);
    return ok(null);
  } catch (e) {
    return fromError(e);
  }
}
