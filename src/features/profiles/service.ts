import { ok, fail } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import { serverLogger } from "@/lib/logger/server-logger";
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ID } from '@/types';

export type ProfileRow = {
  id: string;
  email: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_active: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

/**
 * Service layer for managing user profiles in Supabase.
 */
export class ProfilesService {
  /**
   * Retrieves a user profile by profile ID.
   *
   * @param id - Profile ID.
   * @returns ServiceResult wrapping ProfileRow.
   */
  async getById(id: ID): Promise<ServiceResult<ProfileRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (error) return fail(error.message);
      return ok(data as ProfileRow);
    } catch (error) {
      serverLogger.error('ProfilesService.getById failed', error as Error);
      return fail('Profile fetch failed.');
    }
  }

  /**
   * Updates partial profile fields for a user profile.
   *
   * @param id - Target profile ID.
   * @param updates - Partial profile fields to update.
   * @returns ServiceResult wrapping updated ProfileRow.
   */
  async updateProfile(id: ID, updates: Partial<ProfileRow>): Promise<ServiceResult<ProfileRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await (supabase.from('profiles') as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) return fail(error.message);
      return ok(data as ProfileRow);
    } catch (error) {
      serverLogger.error('ProfilesService.updateProfile failed', error as Error);
      return fail('Profile update failed.');
    }
  }
}

export const profilesService = new ProfilesService();
