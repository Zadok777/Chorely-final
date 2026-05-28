import { supabase } from '../lib/supabase';
import type { Family, FamilyMember } from '../types/app.types';
import type { ServiceResult } from '../types/result';
import { fail, fromError, ok } from '../types/result';

// RLS already filters families to those the caller is a member of, so the
// returned list is naturally scoped to the current user's families.
export async function listMyFamilies(): Promise<ServiceResult<Family[]>> {
  try {
    const { data, error } = await supabase
      .from('families')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return fail(error.message);
    return ok(data ?? []);
  } catch (e) {
    return fromError(e);
  }
}

export async function getFamily(
  id: string
): Promise<ServiceResult<Family | null>> {
  try {
    const { data, error } = await supabase
      .from('families')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) return fail(error.message);
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

export async function renameFamily(
  id: string,
  name: string
): Promise<ServiceResult<Family>> {
  try {
    const { data, error } = await supabase
      .from('families')
      .update({ name })
      .eq('id', id)
      .select('*')
      .single();
    if (error) return fail(error.message);
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

export async function listFamilyMembers(
  familyId: string
): Promise<ServiceResult<FamilyMember[]>> {
  try {
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('family_id', familyId);
    if (error) return fail(error.message);
    return ok(data ?? []);
  } catch (e) {
    return fromError(e);
  }
}
