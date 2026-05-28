import { supabase } from '../lib/supabase';
import type { UserSettings } from '../types/app.types';
import type { TablesUpdate } from '../types/database.types';
import type { ServiceResult } from '../types/result';
import { fail, fromError, ok } from '../types/result';

// Reads the current user's settings row. Returns null if no row exists yet —
// complete_onboarding creates the row, so a signed-in user mid-onboarding
// can legitimately have no settings row.
export async function getMySettings(): Promise<
  ServiceResult<UserSettings | null>
> {
  try {
    const userRes = await supabase.auth.getUser();
    if (userRes.error) return fail(userRes.error.message);
    if (!userRes.data.user) return ok(null);

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userRes.data.user.id)
      .maybeSingle();
    if (error) return fail(error.message);
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

export async function updateMySettings(
  patch: TablesUpdate<'user_settings'>
): Promise<ServiceResult<UserSettings>> {
  try {
    const userRes = await supabase.auth.getUser();
    if (userRes.error) return fail(userRes.error.message);
    if (!userRes.data.user) return fail('Not signed in');

    const { data, error } = await supabase
      .from('user_settings')
      .update(patch)
      .eq('user_id', userRes.data.user.id)
      .select('*')
      .single();
    if (error) return fail(error.message);
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}
