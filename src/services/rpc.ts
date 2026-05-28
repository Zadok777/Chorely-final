// Typed wrappers around every SECURITY DEFINER RPC in the database.
// Screens and stores import from this module — never from supabase-js directly —
// so RPC names and arg shapes are validated against the generated database
// types at every call site.

import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import type { ServiceResult } from '../types/result';
import { fail, fromError, ok } from '../types/result';

type Fns = Database['public']['Functions'];

export type SubmitChoreResult = Fns['submit_chore']['Returns'];
export type ApproveChoreResult = Fns['approve_chore']['Returns'];
export type RejectChoreResult = Fns['reject_chore']['Returns'];
export type RedeemRewardResult = Fns['redeem_reward']['Returns'];
export type JoinFamilyResult = Fns['join_family_by_code']['Returns'];
export type CompleteOnboardingResult = Fns['complete_onboarding']['Returns'];

export async function submitChore(
  assignmentId: string
): Promise<ServiceResult<SubmitChoreResult>> {
  try {
    const { data, error } = await supabase.rpc('submit_chore', {
      p_assignment_id: assignmentId,
    });
    if (error) return fail(error.message);
    if (!data) return fail('submit_chore returned no data');
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

export async function approveChore(
  assignmentId: string
): Promise<ServiceResult<ApproveChoreResult>> {
  try {
    const { data, error } = await supabase.rpc('approve_chore', {
      p_assignment_id: assignmentId,
    });
    if (error) return fail(error.message);
    if (!data) return fail('approve_chore returned no data');
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

export async function rejectChore(
  assignmentId: string,
  note?: string
): Promise<ServiceResult<RejectChoreResult>> {
  try {
    const args: Fns['reject_chore']['Args'] = { p_assignment_id: assignmentId };
    if (note !== undefined) args.p_note = note;
    const { data, error } = await supabase.rpc('reject_chore', args);
    if (error) return fail(error.message);
    if (!data) return fail('reject_chore returned no data');
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

export async function redeemReward(
  rewardId: string,
  childId: string
): Promise<ServiceResult<RedeemRewardResult>> {
  try {
    const { data, error } = await supabase.rpc('redeem_reward', {
      p_reward_id: rewardId,
      p_child_id: childId,
    });
    if (error) return fail(error.message);
    if (!data) return fail('redeem_reward returned no data');
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

// update_streak returns void. Callers usually invoke it after approve_chore
// and rely on the subsequent children-row read to see the new streak value.
export async function updateStreak(
  childId: string,
  familyId: string,
  actorId: string
): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase.rpc('update_streak', {
      p_child_id: childId,
      p_family_id: familyId,
      p_actor_id: actorId,
    });
    if (error) return fail(error.message);
    return ok(null);
  } catch (e) {
    return fromError(e);
  }
}

export async function joinFamilyByCode(
  code: string
): Promise<ServiceResult<JoinFamilyResult>> {
  try {
    const { data, error } = await supabase.rpc('join_family_by_code', {
      p_code: code,
    });
    if (error) return fail(error.message);
    if (!data) return fail('join_family_by_code returned no data');
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

export async function completeOnboarding(
  familyName: string,
  childName: string,
  childDob?: string
): Promise<ServiceResult<CompleteOnboardingResult>> {
  try {
    const args: Fns['complete_onboarding']['Args'] = {
      p_family_name: familyName,
      p_child_name: childName,
    };
    if (childDob !== undefined) args.p_child_dob = childDob;
    const { data, error } = await supabase.rpc('complete_onboarding', args);
    if (error) return fail(error.message);
    if (!data) return fail('complete_onboarding returned no data');
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

export async function deleteUserAccount(): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase.rpc('delete_user_account');
    if (error) return fail(error.message);
    return ok(null);
  } catch (e) {
    return fromError(e);
  }
}
