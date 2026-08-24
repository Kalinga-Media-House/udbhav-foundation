'use client';

import { Loader2, ExternalLink } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { ImageUploader } from '@/components/admin/ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateSettingByKey } from '@/features/system_settings/actions';
import type { SystemSettingRow } from '@/features/system_settings/repository';

interface Props {
  settings: SystemSettingRow[];
}

export function FoundationSeoSettings({ settings: initialSettings }: Props) {
  const [isPending, startTransition] = useTransition();

  const getVal = (key: string) => {
    const s = initialSettings.find((s) => s.key_name === key);
    let val = s?.value;
    if (typeof val === 'string' && val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    }
    return val || '';
  };

  const getArrayVal = (key: string) => {
    const s = initialSettings.find((s) => s.key_name === key);
    if (!s?.value) return [];
    if (Array.isArray(s.value)) return s.value;
    try {
      return JSON.parse(s.value);
    } catch {
      return [];
    }
  };

  const [formData, setFormData] = useState({
    foundation_name: getVal('foundation_name'),
    foundation_tagline: getVal('foundation_tagline'),
    contact_email: getVal('contact_email'),
    contact_phone: getVal('contact_phone'),
    website_url: getVal('website_url'),
    address_primary: getVal('address_primary'),
    logo_primary: getVal('logo_primary'),
    favicon: getVal('favicon'),

    seo_default_title: getVal('seo_default_title'),
    seo_default_desc: getVal('seo_default_desc'),
    seo_search_topics: getArrayVal('seo_search_topics').join(', '),

    og_title: getVal('og_title'),
    og_desc: getVal('og_desc'),
    og_image: getVal('og_image'),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        const updates = [];

        // Helper to format string for JSONB storage correctly
        const formatString = (val: string) => `"${val}"`;
        
        updates.push(updateSettingByKey('foundation_name', formatString(formData.foundation_name)));
        updates.push(updateSettingByKey('foundation_tagline', formatString(formData.foundation_tagline)));
        updates.push(updateSettingByKey('contact_email', formatString(formData.contact_email)));
        updates.push(updateSettingByKey('contact_phone', formatString(formData.contact_phone)));
        updates.push(updateSettingByKey('website_url', formatString(formData.website_url)));
        updates.push(updateSettingByKey('address_primary', formatString(formData.address_primary)));
        updates.push(updateSettingByKey('logo_primary', formatString(formData.logo_primary)));
        updates.push(updateSettingByKey('favicon', formatString(formData.favicon)));
        
        updates.push(updateSettingByKey('seo_default_title', formatString(formData.seo_default_title)));
        updates.push(updateSettingByKey('seo_default_desc', formatString(formData.seo_default_desc)));
        
        const topicsArray = formData.seo_search_topics.split(',').map((s: string) => s.trim()).filter(Boolean);
        updates.push(updateSettingByKey('seo_search_topics', topicsArray));
        
        updates.push(updateSettingByKey('og_title', formatString(formData.og_title)));
        updates.push(updateSettingByKey('og_desc', formatString(formData.og_desc)));
        updates.push(updateSettingByKey('og_image', formatString(formData.og_image)));

        await Promise.all(updates);
        
        toast.success('Settings saved successfully');
      } catch (err: any) {
        toast.error(err.message || 'Failed to save settings');
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Foundation Identity */}
      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Foundation Identity</h2>
          <p className="text-sm text-gray-500 mt-1">These details are used across the public website, contact information, branding and organization metadata. Update them here whenever the Foundation&apos;s official information changes.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Foundation Name</Label>
              <Input name="foundation_name" value={formData.foundation_name} onChange={handleChange} placeholder="UDBHAV Foundation" />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input name="foundation_tagline" value={formData.foundation_tagline} onChange={handleChange} placeholder="Growing Together for an Inclusive Future" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input name="contact_email" value={formData.contact_email} onChange={handleChange} placeholder="admin@udbhavfoundation.in" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input name="contact_phone" value={formData.contact_phone} onChange={handleChange} placeholder="+91 63705 08606" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Address</Label>
              <Input name="address_primary" value={formData.address_primary} onChange={handleChange} placeholder="Plot No. 1519, Bharat Petroleum, 4269/4967, Besides/Above Bandhan Bank, Soubhagya Nagar, Baramunda, Bhubaneswar, Odisha – 751003" />
            </div>
            <div className="space-y-2">
              <Label>Logo</Label>
              {formData.logo_primary && (
                <div className="mb-2">
                  <img src={formData.logo_primary} alt="Logo" className="h-12 w-auto object-contain bg-gray-50 rounded" />
                </div>
              )}
              <ImageUploader 
                onUploadComplete={(result: any) => {
                  const url = Array.isArray(result) ? result[0]?.url : result?.url;
                  if (url) setFormData(prev => ({ ...prev, logo_primary: url }));
                }} 
                folder="settings" 
              />
            </div>
            <div className="space-y-2">
              <Label>Favicon</Label>
              {formData.favicon && (
                <div className="mb-2">
                  <img src={formData.favicon} alt="Favicon" className="h-8 w-8 object-contain bg-gray-50 rounded" />
                </div>
              )}
              <ImageUploader 
                onUploadComplete={(result: any) => {
                  const url = Array.isArray(result) ? result[0]?.url : result?.url;
                  if (url) setFormData(prev => ({ ...prev, favicon: url }));
                }} 
                folder="settings" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Search Engine Optimization</h2>
          <p className="text-sm text-gray-500 mt-1">Default meta tags and search topics.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>SEO Site Title</Label>
            <Input name="seo_default_title" value={formData.seo_default_title} onChange={handleChange} placeholder="UDBHAV Foundation | Growing Together for an Inclusive Future" />
            <p className="text-xs text-gray-500">Used as the default search-engine title for the website.</p>
          </div>
          <div className="space-y-2">
            <Label>Meta Description</Label>
            <Textarea name="seo_default_desc" value={formData.seo_default_desc} onChange={handleChange} rows={3} placeholder="UDBHAV Foundation is a nonprofit organization working to empower communities through education, inclusion, environmental responsibility and collective action." />
            <p className="text-xs text-gray-500">Used as the default description shown to search engines and when pages are shared.</p>
          </div>
          <div className="space-y-2">
            <Label>Search Topics (Comma separated)</Label>
            <Textarea name="seo_search_topics" value={formData.seo_search_topics} onChange={handleChange} rows={3} placeholder="UDBHAV Foundation, nonprofit organization Odisha, community development Odisha, education, environmental responsibility, inclusion, youth empowerment, volunteering Odisha, social impact Odisha" />
            <p className="text-xs text-gray-500">Describe the Foundation&apos;s main areas of work. Keep topics natural and relevant.</p>
          </div>
          <div className="space-y-2">
            <Label>Site URL</Label>
            <Input name="website_url" value={formData.website_url} onChange={handleChange} placeholder="https://udbhavfoundation.in" />
            <p className="text-xs text-gray-500">Use the official public website URL.</p>
          </div>
        </div>
      </section>

      {/* Social Sharing */}
      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Social Sharing</h2>
          <p className="text-sm text-gray-500 mt-1">Appearance when links are shared on social media.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Open Graph Title</Label>
                <Input name="og_title" value={formData.og_title} onChange={handleChange} placeholder="UDBHAV Foundation | Growing Together for an Inclusive Future" />
              </div>
              <div className="space-y-2">
                <Label>Open Graph Description</Label>
                <Textarea name="og_desc" value={formData.og_desc} onChange={handleChange} rows={4} placeholder="UDBHAV Foundation works to empower communities through education, inclusion, environmental responsibility and collective action for a more inclusive and sustainable future." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Social Sharing Image</Label>
              <p className="text-xs text-gray-500 mb-1">Recommended size: 1200 × 630 px.</p>
              {formData.og_image && (
                <div className="mb-2">
                  <img src={formData.og_image} alt="OG Image" className="h-32 w-auto object-cover bg-gray-50 rounded" />
                </div>
              )}
              <ImageUploader 
                onUploadComplete={(result: any) => {
                  const url = Array.isArray(result) ? result[0]?.url : result?.url;
                  if (url) setFormData(prev => ({ ...prev, og_image: url }));
                }} 
                folder="settings" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Preview */}
      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Search Preview</h2>
        </div>
        <div className="p-6">
          <div className="max-w-2xl">
            <div className="mb-1 text-sm text-[#202124] flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {formData.favicon ? (
                  <img src={formData.favicon} alt="Favicon" className="w-4 h-4 object-contain" />
                ) : (
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm">{formData.foundation_name || 'UDBHAV Foundation'}</span>
                <span className="text-xs text-[#4d5156]">{formData.website_url || 'https://udbhavfoundation.in'}</span>
              </div>
            </div>
            <div className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate mb-1">
              {formData.seo_default_title || 'UDBHAV Foundation | Empowering Communities for an Inclusive Future'}
            </div>
            <div className="text-sm text-[#4d5156] line-clamp-2">
              {formData.seo_default_desc || 'UDBHAV Foundation is a nonprofit organization working to empower communities...'}
            </div>
            <p className="text-xs text-gray-400 mt-4 italic">Preview only — actual search appearance may vary by search engine.</p>
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
