'use client';

import { Loader2 } from 'lucide-react';
import React, { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateSettingByKey } from '@/features/system_settings/actions';
import type { SystemSettingRow } from '@/features/system_settings/repository';

interface Props {
  title: string;
  description?: string;
  settings: SystemSettingRow[];
}

export function DynamicSettingsForm({ title, description, settings: initialSettings }: Props) {
  const [settings, setSettings] = useState<SystemSettingRow[]>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        // Save all changed settings
        for (const setting of settings) {
          const initial = initialSettings.find((s) => s.key_name === setting.key_name);
          if (initial && initial.value !== setting.value) {
            // Re-wrap string values in quotes to maintain JSONB storage compatibility 
            // if the original value had them (based on how string settings are seeded)
            let valToSave = setting.value;
            if (setting.data_type === 'string' && typeof valToSave === 'string' && !valToSave.startsWith('"')) {
               valToSave = `"${valToSave}"`;
            }
            await updateSettingByKey(setting.key_name, valToSave);
          }
        }
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        setError(err.message || 'Failed to save settings');
      }
    });
  };

  const updateLocalSetting = (key_name: string, value: any) => {
    setSettings((prev) =>
      prev.map((s) => (s.key_name === key_name ? { ...s, value } : s))
    );
  };

  const getCleanValue = (val: any) => {
    if (typeof val === 'string' && val.startsWith('"') && val.endsWith('"')) {
      return val.substring(1, val.length - 1);
    }
    return val;
  };

  if (!settings || settings.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm mb-8">
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="space-y-5 p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {settings.map((setting) => (
            <div
              key={setting.key_name}
              className={`space-y-1.5 ${setting.data_type === 'boolean' ? 'sm:col-span-2 flex items-center justify-between' : ''} ${setting.data_type === 'string' && (setting.key_name.includes('address') || setting.key_name.includes('desc')) ? 'sm:col-span-2' : ''}`}
            >
              <div>
                <label className="text-sm font-medium text-gray-700">{setting.display_name}</label>
                {setting.description && (
                  <p className="text-xs text-gray-500 mb-1">{setting.description}</p>
                )}
              </div>

              {setting.data_type === 'boolean' ? (
                <div className="mt-0">
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={setting.value === true || setting.value === 'true'}
                      onChange={(e) => updateLocalSetting(setting.key_name, e.target.checked)}
                      disabled={!setting.is_editable || isPending}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                  </label>
                </div>
              ) : setting.key_name.includes('address') || setting.key_name.includes('desc') ? (
                <textarea
                  className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  value={getCleanValue(setting.value)}
                  onChange={(e) => updateLocalSetting(setting.key_name, e.target.value)}
                  disabled={!setting.is_editable || isPending}
                />
              ) : (
                <Input
                  className="mt-1"
                  value={getCleanValue(setting.value)}
                  onChange={(e) => updateLocalSetting(setting.key_name, e.target.value)}
                  disabled={!setting.is_editable || isPending}
                />
              )}
            </div>
          ))}
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        {success && <p className="text-sm text-green-600 mt-2">Successfully saved.</p>}
      </div>
      <div className="flex justify-end border-t border-gray-100 bg-gray-50/50 px-6 py-3">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </section>
  );
}
