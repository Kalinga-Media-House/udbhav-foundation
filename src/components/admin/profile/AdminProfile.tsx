/* eslint-disable */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { processUploadedImage, requestImageUpload } from '@/features/media/upload-actions';
import { getMyProfile, updateMyProfile, updatePassword } from '@/features/profiles/actions';
import type { ProfileRow } from '@/features/profiles/service';

export function AdminProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        if (res.success && res.data) {
          setProfile(res.data);
          setFirstName(res.data.first_name || '');
          setLastName(res.data.last_name || '');
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load profile');
        setLoading(false);
      });
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await updateMyProfile({ first_name: firstName, last_name: lastName });
      if (res.success && res.data) {
        setProfile(res.data);
        toast.success('Profile updated successfully');
      } else {
        toast.error(res.error || 'Failed to update profile');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      return toast.error('Passwords do not match');
    }
    setSaving(true);
    try {
      const res = await updatePassword(passwords.new);
      if (res.success !== false) {
        toast.success('Password updated successfully');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        toast.error(res.error || 'Failed to update password');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating password');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large (max 5MB)', { id: 'avatar-upload' });
      return;
    }

    try {
      toast.loading('Requesting upload URL...', { id: 'avatar-upload' });

      // Phase 1: Request URL
      const req = await requestImageUpload({
        filename: file.name,
        size: file.size,
        contentType: file.type,
        folder: 'avatars',
      });
      const reqData = req.data;
      if (!req.success || !reqData) throw new Error(req.error || 'Failed to get upload URL');

      toast.loading('Uploading image...', { id: 'avatar-upload' });

      // Phase 2: Upload to presigned URL
      const xhr = new XMLHttpRequest();
      await new Promise<void>((resolve, reject) => {
        xhr.open('PUT', reqData.url);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed with HTTP ${xhr.status}: ${xhr.statusText}`));
        xhr.onerror = () => reject(new Error('Upload failed: Network error or CORS blocked by Cloudflare R2.'));
        xhr.ontimeout = () => reject(new Error('Upload timed out'));
        xhr.timeout = 60_000;
        xhr.send(file);
      });

      toast.loading('Optimizing image...', { id: 'avatar-upload' });

      // Phase 3: Server process and save
      const processRes = await processUploadedImage(reqData.storageKey, file.name, 'avatars');
      const processData = processRes.data;
      if (!processRes.success || !processData)
        throw new Error(processRes.error || 'Optimization failed');

      toast.loading('Updating profile...', { id: 'avatar-upload' });

      // Phase 4: Link to profile
      const updateRes = await updateMyProfile({ avatar_url: processData.cdnUrl });
      if (!updateRes.success) throw new Error(updateRes.error || 'Failed to link avatar');

      setProfile((prev) => (prev ? { ...prev, avatar_url: processData.cdnUrl } : prev));
      toast.success('Avatar updated successfully', { id: 'avatar-upload' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload avatar', { id: 'avatar-upload' });
    }
  };

  if (loading) return <div className="animate-pulse p-8">Loading profile...</div>;
  if (!profile) return <div className="p-8">Failed to load profile.</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h2>

        <div className="mb-6 flex space-x-4 border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-1 pb-3 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile & Avatar
          </button>
          <button
            className={`px-1 pb-3 text-sm font-medium transition-colors ${activeTab === 'security' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('security')}
          >
            Security & Password
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-6 duration-300 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-1">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white dark:bg-gray-800">
                    <img
                      src={
                        profile.avatar_url ||
                        `https://api.dicebear.com/7.x/avataars/svg?seed=${profile.email}`
                      }
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 rounded-full border border-gray-100 bg-white p-2 text-gray-700 shadow-lg transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Admin Avatar</h3>
                <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                  JPG, GIF or PNG. Max size of 800K
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Upload New
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  value={profile.email || ''}
                  readOnly
                  className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-500 outline-none transition-all dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
                />
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-500/30 transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              Save Profile
            </button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6 duration-300 animate-in fade-in slide-in-from-bottom-2">
            <div className="max-w-md space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                onClick={handleSavePassword}
                disabled={saving || !passwords.new}
                className="mt-4 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-500/30 transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                Update Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
