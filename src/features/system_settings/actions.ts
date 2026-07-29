'use server';

import { revalidateTag } from 'next/cache';

import { handleAction, requireAuth, requirePermission } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';

import type { SystemSettingRow } from './repository';
import { systemSettingsService } from './service';

export async function listSettings(): Promise<ActionResult<SystemSettingRow[]>> {
  return handleAction('listSettings', async () => {
    const session = await requireAuth();
    requirePermission(session, 'settings.read');
    const result = await systemSettingsService.listSettings();
    if (!result.success) throw new Error(result.error ?? 'Failed to list settings');
    return result.data!;
  });
}

export async function getSettingByKey(key_name: string): Promise<ActionResult<SystemSettingRow>> {
  return handleAction('getSettingByKey', async () => {
    const session = await requireAuth();
    requirePermission(session, 'settings.read');
    const result = await systemSettingsService.getSettingByKey(key_name);
    if (!result.success) throw new Error(result.error ?? 'Failed to get setting');
    return result.data!;
  });
}

export async function updateSettingByKey(key_name: string, value: any): Promise<ActionResult<SystemSettingRow>> {
  return handleAction('updateSettingByKey', async () => {
    const session = await requireAuth();
    requirePermission(session, 'settings.write');
    const result = await systemSettingsService.updateSettingByKey(key_name, value, session.id);
    if (!result.success) throw new Error(result.error ?? 'Failed to update setting');
    revalidateTag('system_settings');
    return result.data!;
  });
}
