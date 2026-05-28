import { supabase } from '../lib/supabase';
import type { Reward, RewardRedemption } from '../types/app.types';
import type { TablesInsert, TablesUpdate } from '../types/database.types';
import type { ServiceResult } from '../types/result';
import { fail, fromError, ok } from '../types/result';

export async function listRewards(
  familyId: string
): Promise<ServiceResult<Reward[]>> {
  try {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: false });
    if (error) return fail(error.message);
    return ok(data ?? []);
  } catch (e) {
    return fromError(e);
  }
}

export async function createReward(
  input: TablesInsert<'rewards'>
): Promise<ServiceResult<Reward>> {
  try {
    const { data, error } = await supabase
      .from('rewards')
      .insert(input)
      .select('*')
      .single();
    if (error) return fail(error.message);
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

export async function updateReward(
  id: string,
  patch: TablesUpdate<'rewards'>
): Promise<ServiceResult<Reward>> {
  try {
    const { data, error } = await supabase
      .from('rewards')
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

export async function deleteReward(id: string): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase.from('rewards').delete().eq('id', id);
    if (error) return fail(error.message);
    return ok(null);
  } catch (e) {
    return fromError(e);
  }
}

// Like chore_assignments, reward_redemptions has no family_id column.
// Scope through children, which do carry family_id.
export async function listRedemptionsForFamily(
  familyId: string
): Promise<ServiceResult<RewardRedemption[]>> {
  try {
    const childIdsRes = await supabase
      .from('children')
      .select('id')
      .eq('family_id', familyId);
    if (childIdsRes.error) return fail(childIdsRes.error.message);
    const childIds = (childIdsRes.data ?? []).map((row) => row.id);
    if (childIds.length === 0) return ok([]);

    const { data, error } = await supabase
      .from('reward_redemptions')
      .select('*')
      .in('child_id', childIds)
      .order('redeemed_at', { ascending: false });
    if (error) return fail(error.message);
    return ok(data ?? []);
  } catch (e) {
    return fromError(e);
  }
}

export async function listRedemptionsForChild(
  childId: string
): Promise<ServiceResult<RewardRedemption[]>> {
  try {
    const { data, error } = await supabase
      .from('reward_redemptions')
      .select('*')
      .eq('child_id', childId)
      .order('redeemed_at', { ascending: false });
    if (error) return fail(error.message);
    return ok(data ?? []);
  } catch (e) {
    return fromError(e);
  }
}

export async function markRedemptionFulfilled(
  id: string
): Promise<ServiceResult<RewardRedemption>> {
  try {
    const userRes = await supabase.auth.getUser();
    if (userRes.error) return fail(userRes.error.message);
    if (!userRes.data.user) return fail('Not signed in');

    const { data, error } = await supabase
      .from('reward_redemptions')
      .update({
        fulfilled_at: new Date().toISOString(),
        fulfilled_by: userRes.data.user.id,
      })
      .eq('id', id)
      .select('*')
      .single();
    if (error) return fail(error.message);
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}
