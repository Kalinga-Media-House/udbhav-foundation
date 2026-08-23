/* eslint-disable @typescript-eslint/no-explicit-any */
import { fromRepo } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import type { ID } from '@/types';

import { systemSettingsRepository } from './repository';
import type { SystemSettingRow } from './repository';

export class SystemSettingsService {
  async listSettings(): Promise<ServiceResult<SystemSettingRow[]>> {
    return fromRepo(await systemSettingsRepository.listSettings());
  }

  async getSettingByKey(key_name: string): Promise<ServiceResult<SystemSettingRow>> {
    return fromRepo(await systemSettingsRepository.getSettingByKey(key_name));
  }

  async updateSettingByKey(key_name: string, value: any, userId: ID): Promise<ServiceResult<SystemSettingRow>> {
    return fromRepo(await systemSettingsRepository.updateSettingByKey(key_name, value, userId));
  }
}

export const systemSettingsService = new SystemSettingsService();
