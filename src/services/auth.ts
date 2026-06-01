import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '../lib/supabase';
import type { Profile } from '../types/app.types';
import type { ServiceResult } from '../types/result';
import { fail, fromError, ok } from '../types/result';

export async function signUp(
  email: string,
  password: string,
  displayName?: string
): Promise<ServiceResult<{ user: User | null; session: Session | null }>> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options:
        displayName !== undefined && displayName.length > 0
          ? { data: { display_name: displayName } }
          : undefined,
    });
    if (error) return fail(error.message);
    return ok({ user: data.user, session: data.session });
  } catch (e) {
    return fromError(e);
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<ServiceResult<{ user: User; session: Session }>> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return fail(error.message);
    if (!data.user || !data.session) {
      return fail('Sign in returned no session');
    }
    return ok({ user: data.user, session: data.session });
  } catch (e) {
    return fromError(e);
  }
}

// Sends a recovery email containing a 6-digit code. The Supabase "Reset
// Password" email template must expose {{ .Token }} (see docs/launch). We use
// a code (OTP) rather than a magic link so no deep-linking setup is needed.
export async function requestPasswordReset(
  email: string
): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return fail(error.message);
    return ok(null);
  } catch (e) {
    return fromError(e);
  }
}

// Verifies the recovery code, which signs the user in, then sets the new
// password. On success the user is authenticated (the app routes them in).
export async function confirmPasswordReset(
  email: string,
  token: string,
  newPassword: string
): Promise<ServiceResult<null>> {
  try {
    const verify = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery',
    });
    if (verify.error) return fail(verify.error.message);
    const update = await supabase.auth.updateUser({ password: newPassword });
    if (update.error) return fail(update.error.message);
    return ok(null);
  } catch (e) {
    return fromError(e);
  }
}

export async function signOut(): Promise<ServiceResult<null>> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return fail(error.message);
    return ok(null);
  } catch (e) {
    return fromError(e);
  }
}

export async function getSession(): Promise<ServiceResult<Session | null>> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) return fail(error.message);
    return ok(data.session);
  } catch (e) {
    return fromError(e);
  }
}

export async function getUser(): Promise<ServiceResult<User | null>> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) return fail(error.message);
    return ok(data.user);
  } catch (e) {
    return fromError(e);
  }
}

// Fetches the authenticated user's profile row. Returns null if no session
// exists; the `handle_new_user` trigger guarantees a profile row exists for
// every auth.users row, so a signed-in user with no profile would be a bug.
export async function getMyProfile(): Promise<ServiceResult<Profile | null>> {
  try {
    const userRes = await supabase.auth.getUser();
    if (userRes.error) return fail(userRes.error.message);
    if (!userRes.data.user) return ok(null);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userRes.data.user.id)
      .maybeSingle();
    if (error) return fail(error.message);
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

export async function updateMyProfile(patch: {
  display_name?: string;
  avatar_url?: string | null;
  avatar_gradient?: number | null;
  avatar_icon?: string | null;
}): Promise<ServiceResult<Profile>> {
  try {
    const userRes = await supabase.auth.getUser();
    if (userRes.error) return fail(userRes.error.message);
    if (!userRes.data.user) return fail('Not signed in');

    const { data, error } = await supabase
      .from('profiles')
      .update(patch)
      .eq('id', userRes.data.user.id)
      .select('*')
      .single();
    if (error) return fail(error.message);
    return ok(data);
  } catch (e) {
    return fromError(e);
  }
}

// Direct passthrough — returning the supabase subscription so the caller can
// `.unsubscribe()` in a cleanup. Wrapping this in ServiceResult would force
// every consumer to handle a never-failing path.
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}
