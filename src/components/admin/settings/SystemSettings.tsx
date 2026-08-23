/* eslint-disable */
'use client';

import { Loader2, Save } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { listSettings, updateSettingByKey } from '@/features/system_settings/actions';


export function SystemSettings() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await listSettings();
        if (res.data) setSettings(res.data);
      } catch (e: any) {
        toast.error(e.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (key_name: string, value: any) => {
    setSaving(true);
    try {
      await updateSettingByKey(key_name, value);
      toast.success('Setting updated successfully');
    } catch (e: any) {
      toast.error(e.message || 'Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const grouped = settings.reduce((acc, setting) => {
    const cat = setting.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(setting);
    return acc;
  }, {} as Record<string, any[]>);

  const categories = Object.keys(grouped).sort();

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
      <Tabs defaultValue={categories[0]} className="w-full">
        <div className="px-4 pt-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <TabsList className="bg-transparent space-x-2">
            {categories.map((cat) => (
              <TabsTrigger 
                key={cat} 
                value={cat}
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat} className="p-6 m-0">
            <div className="space-y-8 max-w-2xl">
              {grouped[cat].map((setting: any) => (
                <div key={setting.id} className="flex flex-col space-y-2 pb-6 border-b border-zinc-100 dark:border-zinc-800 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={setting.key_name} className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                        {setting.display_name}
                      </Label>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{setting.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-center mt-4">
                    {setting.data_type === 'boolean' ? (
                      <Switch 
                        id={setting.key_name}
                        checked={setting.value === 'true' || setting.value === true}
                        onCheckedChange={(checked) => {
                          const updated = [...settings];
                          const idx = updated.findIndex(s => s.id === setting.id);
                          updated[idx].value = checked;
                          setSettings(updated);
                          handleSave(setting.key_name, checked);
                        }}
                        disabled={!setting.is_editable || saving}
                      />
                    ) : (
                      <div className="flex-1 flex gap-2">
                        <Input 
                          id={setting.key_name}
                          value={typeof setting.value === 'string' ? setting.value.replace(/^"|"$/g, '') : setting.value}
                          onChange={(e) => {
                            const updated = [...settings];
                            const idx = updated.findIndex(s => s.id === setting.id);
                            updated[idx].value = e.target.value;
                            setSettings(updated);
                          }}
                          disabled={!setting.is_editable || saving}
                          className="flex-1"
                        />
                        <Button 
                          variant="secondary" 
                          onClick={() => handleSave(setting.key_name, setting.value)}
                          disabled={!setting.is_editable || saving}
                        >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
