import { supabase } from '../lib/supabase';
import type { Goal } from '../types/app.types';
import type { TablesInsert, TablesUpdate } from '../types/database.types';
import type { ServiceResult } from '../types/result';
import { fail, fromError, ok } from '../types/result';

// RLS scopes goals to the caller's families, so the list is naturally family-scoped.
export async function listGoals(
  familyId: string
): Promise<ServiceResult<Goal[]>> {
  try {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('family_id', familyId)
      .eq('is_active', true)
      .order('created_at', { ascending: true });
    if (error) return fail(error.message);
    return ok(data ?? []);
  } catch (e) {
    return fromError(e);
  }
}

export async function createGoal(
  input: TablesInsert<'goals'>
): Promise<ServiceResult<Goal>> {
  try {
    const { data, error } = await supabase
      .from('goals')
      .insert(input)
      .select('*')
      .single();
    if (error) return fail(error.message);
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

export async function updateGoal(
  id: string,
  patch: TablesUpdate<'goals'>
): Promise<ServiceResult<Goal>> {
  try {
    const { data, error } = await supabase
      .from('goals')
      .update(patch)
      .eq('id', id)
      .select('*')
      .single();
    if (error) return fail(error.message);
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

// Stamps reached_at once (only if still null) so the celebration fires exactly
// one time. Returns the updated row, or null if it was already stamped.
export async function markGoalReached(
  id: string
): Promise<ServiceResult<Goal | null>> {
  try {
    const { data, error } = await supabase
      .from('goals')
      .update({ reached_at: new Date().toISOString() })
      .eq('id', id)
      .is('reached_at', null)
      .select('*')
      .maybeSingle();
    if (error) return fail(error.message);
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

export async function deleteGoal(id: string): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) return fail(error.message);
    return ok(null);
  } catch (e) {
    return fromError(e);
  }
}
