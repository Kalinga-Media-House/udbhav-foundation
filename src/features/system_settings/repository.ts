/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RepositoryResult } from '@/contracts/repositories';
import { DatabaseError } from '@/errors';
import { serverLogger } from '@/lib/logger/server-logger';
import { createServerSupabaseClient, createStaticSupabaseClient } from '@/lib/supabase/server';

export type SystemSettingRow = {
  id: string;
  key_name: string;
  display_name: string;
  description: string | null;
  category: string;
  data_type: string;
  value: any;
  default_value: any;
  validation_rules: any;
  is_editable: boolean;
  is_encrypted: boolean;
  visibility: string;
  env_scope: string;
  version: number;
  metadata: any;
  created_at: string;
  updated_at: string;
};

export class SystemSettingsRepository {
  async listSettings(): Promise<RepositoryResult<SystemSettingRow[]>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from('system_settings').select('*').eq('is_deleted', false).order('category');
      if (error) throw new DatabaseError(error.message);
      return { data, error: null };
    } catch (error) {
      serverLogger.error('SystemSettingsRepository.listSettings failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async getSettingByKey(key_name: string): Promise<RepositoryResult<SystemSettingRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from('system_settings').select('*').eq('key_name', key_name).eq('is_deleted', false).single();
      if (error) throw new DatabaseError(error.message);
      return { data, error: null };
    } catch (error) {
      serverLogger.error('SystemSettingsRepository.getSettingByKey failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async updateSettingByKey(key_name: string, value: any, userId: string): Promise<RepositoryResult<SystemSettingRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from('system_settings')
        .update({ value, updated_by: userId } as never)
        .eq('key_name', key_name)
        .eq('is_editable', true)
        .eq('is_deleted', false)
        .select()
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data, error: null };
    } catch (error) {
      serverLogger.error('SystemSettingsRepository.updateSettingByKey failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async getPublicSettings(): Promise<Record<string, any>> {
    try {
      const supabase = createStaticSupabaseClient();
      // Use direct select for better type safety and simpler debugging
      const { data, error } = await supabase
        .from('system_settings')
        .select('key_name, value')
        .eq('visibility', 'public')
        .eq('is_deleted', false);
        
      if (error) throw new DatabaseError(error.message);
      
      const settings = data?.reduce((acc, row) => {
        // Strip out quotes if it's a simple string stored as JSON string
        let val = row.value;
        if (typeof val === 'string' && val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        }
        acc[row.key_name] = val;
        return acc;
      }, {} as Record<string, any>) || {};
      
      return settings;
    } catch (error) {
      serverLogger.error('SystemSettingsRepository.getPublicSettings failed', error as Error);
      return {};
    }
  }
}

export const systemSettingsRepository = new SystemSettingsRepository();
