import { supabase } from '../lib/supabase';
import type { Chore, ChoreAssignment } from '../types/app.types';
import type { TablesInsert, TablesUpdate } from '../types/database.types';
import type { ServiceResult } from '../types/result';
import { fail, fromError, ok } from '../types/result';

export async function listChores(
  familyId: string
): Promise<ServiceResult<Chore[]>> {
  try {
    const { data, error } = await supabase
      .from('chores')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: false });
    if (error) return fail(error.message);
    return ok(data ?? []);
  } catch (e) {
    return fromError(e);
  }
}

export async function createChore(
  input: TablesInsert<'chores'>
): Promise<ServiceResult<Chore>> {
  try {
    const { data, error } = await supabase
      .from('chores')
      .insert(input)
      .select('*')
      .single();
    if (error) return fail(error.message);
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

export async function updateChore(
  id: string,
  patch: TablesUpdate<'chores'>
): Promise<ServiceResult<Chore>> {
  try {
    const { data, error } = await supabase
      .from('chores')
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

export async function deleteChore(id: string): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase.from('chores').delete().eq('id', id);
    if (error) return fail(error.message);
    return ok(null);
  } catch (e) {
    return fromError(e);
  }
}

export async function assignChore(
  input: TablesInsert<'chore_assignments'>
): Promise<ServiceResult<ChoreAssignment>> {
  try {
    const { data, error } = await supabase
      .from('chore_assignments')
      .insert(input)
      .select('*')
      .single();
    if (error) return fail(error.message);
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

// chore_assignments doesn't carry family_id directly, so we scope through
// chores: first fetch the family's chore ids, then assignments where
// chore_id is in that set. Two roundtrips but keeps the returned shape
// as clean ChoreAssignment rows (no embedded join object to strip).
export async function listAssignmentsForFamily(
  familyId: string
): Promise<ServiceResult<ChoreAssignment[]>> {
  try {
    const choreIdsRes = await supabase
      .from('chores')
      .select('id')
      .eq('family_id', familyId);
    if (choreIdsRes.error) return fail(choreIdsRes.error.message);
    const choreIds = (choreIdsRes.data ?? []).map((row) => row.id);
    if (choreIds.length === 0) return ok([]);

    const { data, error } = await supabase
      .from('chore_assignments')
      .select('*')
      .in('chore_id', choreIds)
      .order('assigned_at', { ascending: false });
    if (error) return fail(error.message);
    return ok(data ?? []);
  } catch (e) {
    return fromError(e);
  }
}

export async function listAssignmentsForChild(
  childId: string
): Promise<ServiceResult<ChoreAssignment[]>> {
  try {
    const { data, error } = await supabase
      .from('chore_assignments')
      .select('*')
      .eq('child_id', childId)
      .order('assigned_at', { ascending: false });
    if (error) return fail(error.message);
    return ok(data ?? []);
  } catch (e) {
    return fromError(e);
  }
}

export async function listPendingApprovals(
  familyId: string
): Promise<ServiceResult<ChoreAssignment[]>> {
  try {
    const choreIdsRes = await supabase
      .from('chores')
      .select('id')
      .eq('family_id', familyId);
    if (choreIdsRes.error) return fail(choreIdsRes.error.message);
    const choreIds = (choreIdsRes.data ?? []).map((row) => row.id);
    if (choreIds.length === 0) return ok([]);

    const { data, error } = await supabase
      .from('chore_assignments')
      .select('*')
      .in('chore_id', choreIds)
      .eq('status', 'submitted')
      .order('completed_at', { ascending: true });
    if (error) return fail(error.message);
    return ok(data ?? []);
  } catch (e) {
    return fromError(e);
  }
}
