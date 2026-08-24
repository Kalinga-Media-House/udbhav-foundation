'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { updateSettingByKey } from '@/features/system_settings/actions';
import { updateGoverningBodyMember } from '@/features/governing-body/actions';

interface SettingValue {
  url: string;
  altText?: string;
}

interface AdminAboutPageClientProps {
  initialSettings: {
    about_who_we_are_image: SettingValue | string;
    about_what_we_do_image: SettingValue | string;
    about_when_we_started_image: SettingValue | string;
    about_why_work_matters_image: SettingValue | string;
  };
  founderId: string | null;
  founderImage: string | null;
}

function parseSetting(value: any, fallback: string): SettingValue {
  if (typeof value === 'string') {
    return { url: value, altText: '' };
  }
  if (value && typeof value === 'object') {
    return { url: value.url || fallback, altText: value.altText || '' };
  }
  return { url: fallback, altText: '' };
}

export default function AdminAboutPageClient({
  initialSettings,
  founderId,
  founderImage,
}: AdminAboutPageClientProps) {
  const [settings, setSettings] = useState({
    whoWeAre: parseSetting(initialSettings.about_who_we_are_image, '/hero/hero-02.png'),
    whatWeDo: parseSetting(initialSettings.about_what_we_do_image, '/hero/hero-05.png'),
    whenWeStarted: parseSetting(initialSettings.about_when_we_started_image, '/hero/hero-08.png'),
    whyWorkMatters: parseSetting(initialSettings.about_why_work_matters_image, '/hero/hero-07.png'),
  });

  const [localFounderImage, setLocalFounderImage] = useState(founderImage);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);

  // States for the edit modal
  const [uploadStatus, setUploadStatus] = useState<any>('idle');
  const [draftUrl, setDraftUrl] = useState<string>('');
  const [draftAlt, setDraftAlt] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = (slotKey: string, currentUrl: string, currentAlt: string) => {
    setEditingSlot(slotKey);
    setDraftUrl(currentUrl);
    setDraftAlt(currentAlt || '');
    setUploadStatus('idle');
  };

  const handleCancel = () => {
    setEditingSlot(null);
    setDraftUrl('');
    setDraftAlt('');
    setUploadStatus('idle');
  };

  const handleUploadComplete = (result: any) => {
    const resArray = Array.isArray(result) ? result : [result];
    if (resArray.length > 0) {
      setDraftUrl(resArray[0].cdnUrl);
    }
  };

  const handleSave = async () => {
    if (!draftUrl) {
      toast.error('Please upload an image.');
      return;
    }

    setIsSaving(true);
    const savingToast = toast.loading('Saving changes...');

    try {
      if (editingSlot === 'founder') {
        if (!founderId) throw new Error('Founder record not found in database.');
        const res = await updateGoverningBodyMember(founderId, { photo_url: draftUrl });
        if (!res.success) throw new Error(res.error);
        setLocalFounderImage(draftUrl);
      } else {
        const payload = { url: draftUrl, altText: draftAlt };
        let settingKey = '';
        if (editingSlot === 'whoWeAre') settingKey = 'about_who_we_are_image';
        if (editingSlot === 'whatWeDo') settingKey = 'about_what_we_do_image';
        if (editingSlot === 'whenWeStarted') settingKey = 'about_when_we_started_image';
        if (editingSlot === 'whyWorkMatters') settingKey = 'about_why_work_matters_image';

        const res = await updateSettingByKey(settingKey, payload);
        if (res.error) throw new Error(res.error);

        setSettings((prev) => ({
          ...prev,
          [editingSlot!]: payload,
        }));
      }

      toast.success('Photo updated successfully.', { id: savingToast });
      setEditingSlot(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update photo.', { id: savingToast });
    } finally {
      setIsSaving(false);
    }
  };

  const renderCard = (title: string, slotKey: string, url: string | null, altText?: string) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
        {url ? (
          <Image
            src={url}
            alt={altText || title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <span className="text-gray-400">No image</span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        {slotKey !== 'founder' && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2" title={altText}>
            Alt: {altText || 'None'}
          </p>
        )}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Active
          </span>
          <button
            onClick={() => handleEditClick(slotKey, url || '', altText || '')}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Edit Photo
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderCard('Who Are We?', 'whoWeAre', settings.whoWeAre.url, settings.whoWeAre.altText)}
        {renderCard('What We Do?', 'whatWeDo', settings.whatWeDo.url, settings.whatWeDo.altText)}
        {renderCard('When Did We Start?', 'whenWeStarted', settings.whenWeStarted.url, settings.whenWeStarted.altText)}
        {renderCard('Why Our Work Matters?', 'whyWorkMatters', settings.whyWorkMatters.url, settings.whyWorkMatters.altText)}
        {renderCard('Founder (Jaysuraj Pattanayak)', 'founder', localFounderImage, 'Founder photo')}
      </div>

      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Update {editingSlot === 'founder' ? 'Founder Photo' : 'About Photo'}
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {draftUrl && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Current Photo Preview</h3>
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <Image src={draftUrl} alt="Preview" fill className="object-cover" />
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Upload New Photo</h3>
                <ImageUploader
                  folder="about-page"
                  maxFiles={1}
                  onUploadComplete={handleUploadComplete}
                  onStatusChange={setUploadStatus}
                />
              </div>

              {editingSlot !== 'founder' && (
                <div>
                  <label htmlFor="alt-text" className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Text (Description)
                  </label>
                  <input
                    id="alt-text"
                    type="text"
                    value={draftAlt}
                    onChange={(e) => setDraftAlt(e.target.value)}
                    placeholder="E.g., UDBHAV Foundation volunteers working together"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Provide an accurate description based on the actual uploaded photograph.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={handleCancel}
                disabled={isSaving || uploadStatus === 'uploading' || uploadStatus === 'processing'}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || uploadStatus === 'uploading' || uploadStatus === 'processing' || !draftUrl}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
              >
                {isSaving ? 'Saving...' : 'Save Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
