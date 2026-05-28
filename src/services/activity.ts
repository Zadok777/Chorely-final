import { supabase } from '../lib/supabase';
import type { ActivityLog } from '../types/app.types';
import type { ServiceResult } from '../types/result';
import { fail, fromError, ok } from '../types/result';

export async function listActivity(
  familyId: string,
  limit = 50
): Promise<ServiceResult<ActivityLog[]>> {
  try {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) return fail(error.message);
    return ok(data ?? []);
  } catch (e) {
    return fromError(e);
  }
}

export async function listActivityForChild(
  childId: string,
  limit = 50
): Promise<ServiceResult<ActivityLog[]>> {
  try {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('child_id', childId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) return fail(error.message);
    return ok(data ?? []);
  } catch (e) {
    return fromError(e);
  }
}
