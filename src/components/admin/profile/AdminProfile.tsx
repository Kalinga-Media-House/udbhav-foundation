'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { getMyProfile, updateMyProfile, updatePassword, uploadAvatar } from '@/features/profiles/actions';
import type { ProfileRow } from '@/features/profiles/service';

export function AdminProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getMyProfile().then(res => {
      setProfile(res);
      setLoading(false);
    }).catch(err => {
      toast.error('Failed to load profile');
      setLoading(false);
    });
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const updates = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
    };
    try {
      const updated = await updateMyProfile(updates);
      setProfile(updated);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwords.new.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      await updatePassword(passwords.new);
      toast.success('Password updated successfully');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0y];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      toast.loading('Uploading avatar...', { id: 'avatar-upload' });
      const url = await uploadAvatar(formData);
      setProfile(prev => prev ? { ...prev, avatar_url: url } : prev);
      toast.success('Avatar updated', { id: 'avatar-upload' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload avatar', { id: 'avatar-upload' });
    }
  };

  if (loading) return <div className="p-8 animate-pulse">Loading profile...</div>;
  if (!profile) return <div className="p-8">Failed to load profile.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white darkzbg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Settings</h2>
        
        <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6">
          <button 
            className={`pb-3 px-1 font-medium text-sm transition-colors ${!activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile & Avatar
          </button>
          <button 
            className={`pb-3 px-1 font-medium text-sm transition-colors ${activeTab === 'security' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('security')}
          >
            Security & Password
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-1">
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    <img src={profile.avatar_url || `https://api.dicebear.com/7.x/avataars/svg?seed=${profile.email}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 text-gray-700 dark:text-white p-2 rounded-full shadow-lg border border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Admin Avatar</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">JPG�Q�܈�ˈX^�^�Hو�P�����]ۈ�ې�X��^�
HO��[R[�]�Y���\��[�˘�X��
_B��\�Ә[YOH�MKL���Yܘ^KLL\�Θ��Yܘ^KM�ݙ\����Yܘ^KL�\�Κݙ\����Yܘ^KM�^Yܘ^KM�\�Ν^]�]H��[�Y[�^\�H�۝[YY][H�[��][ۋX��ܜȂ���\�Y�]؝]ۏ���]����]�����ܛH۔�X�Z]^�[�T�ٚ[U\]_H�\�Ә[YOH�ܚYܚYX���LHY�ܚYX���L��\M�M���]��\�Ә[YOH��X�K^KL����X�[�\�Ә[YOH�^\�H�۝[YY][H^Yܘ^KM�\�Ν^Yܘ^KL����\���[YO�X�[��[�]�[YOH��\��ۘ[YH�\OH�^�Y�][�[YO^��ٚ[K��\��ۘ[YH	��H�\�Ә[YOH��Y�[MKL���[�Y[��ܙ\��ܙ\�Yܘ^KL�\�Θ�ܙ\�Yܘ^KM���]�]H\�Θ��Yܘ^KM�^Yܘ^KNL\�Ν^]�]H���\Μ�[��L����\Μ�[��X�YKML���\Θ�ܙ\�]�[��\�[��][�K[�ۙH�[��][ۋX[�ς��]���]��\�Ә[YOH��X�K^KL����X�[�\�Ә[YOH�^\�H�۝[YY][H^Yܘ^KM�\�Ν^Yܘ^KL���\��[YO�X�[��[�]�[YOH�\�ۘ[YH�\OH�^�Y�][�[YO^��ٚ[K�\�ۘ[YH	��H�\�Ә[YOH��Y�[MKL���[�Y[��ܙ\��ܙ\�Yܘ^KL�\�Θ�ܙ\�Yܘ^KM���]�]H\�Θ��Yܘ^KM�^Yܘ^KNL\�Ν^]�]H���\Μ�[��L����\Μ�[��X�YKML���\Θ�ܙ\�]�[��\�[��][�K[�ۙH�[��][ۋX[�ς��]���]��\�Ә[YOH��X�K^KL����X�[�\�Ә[YOH�^\�H�۝[YY][H^Yܘ^KM�\�Ν^Yܘ^KL���[XZ[Y�\���X�[��[�]\OH�[XZ[��[YO^��ٚ[K�[XZ[H\�X�Y�\�Ә[YOH��Y�[MKL���[�Y[��ܙ\��ܙ\�Yܘ^KL�\�Θ�ܙ\�Yܘ^KM���Yܘ^KLL\�Θ��Yܘ^KM�^Yܘ^KML\�Ν^Yܘ^KM�][�K[�ۙH�\��܋[��X[��Y�ς��]���]��\�Ә[YOH�Y���\�[�L�L�����]ۈ\�X�Y^��]�[��H\OH��X�Z]��\�Ә[YOH�M�KL��H��X�YKM�ݙ\����X�YKM�^]�]H��[�Y[�^\�H�۝[YY][H�[��][ۋX��ܜ��Y��\�H\�X�Y��X�]KML�����]�[���	��]�[�ˋ����	��]�H�ٚ[I�B�؝]ۏ���]���ٛܛO���]���
_B���X�]�UX�OOH	��X�\�]I�	��
�]��\�Ә[YOH��X�K^KM�[�[X]KZ[��YKZ[��YKZ[�Y���KX���KL�\�][ۋL�����ܛH۔�X�Z]^�[�T\���ܙ\]_H�\�Ә[YOH��X�K^KMX^]�[Y���]��\�Ә[YOH��X�K^KL����X�[�\�Ә[YOH�^\�H�۝[YY][H^Yܘ^KM�\�Ν^Yܘ^KL����]�\���ܙ�X�[��[�]�\OH�\���ܙ���[YO^�\���ܙ˛�]�B�ې�[��O^�JHO��]\���ܙ�ˋ��\���ܙ��]ΈK�\��]��[Y_J_B�X�Z�\�H��(��(��(��(��(��(��(��(��(�����������������������9����ܵ�ձ����Ё��ȁɽչ���������ɑ�ȁ��ɑ�ȵ�Ʌ�������ɬ鉽ɑ�ȵ�Ʌ��������ݡ�є���ɬ鉜��Ʌ�����ѕ�е�Ʌ�������ɬ�ѕ�еݡ�є�������ɥ���ȁ������ɥ�����Ք����������鉽ɑ�ȵ�Ʌ����ɕ�Ё��ѱ����������Ʌ�ͥѥ��������(������������������ɕ�եɕ�(������������������(��������������𽑥��(���������������؁�����9�����������Ȉ�(����������������񱅉��������9����ѕ�еʹ����е����մ�ѕ�е�Ʌ�������ɬ�ѕ�е�Ʌ����������ɴ�9�܁A���ݽɐ𽱅����(�������������������Ѐ(���������������������������ݽɐ��(������������������م�Ք������ݽɑ̹�����ɵ�(��������������������������졔�����͕�A���ݽɑ̡츸�����ݽɑ̰������ɴ联�хɝ�йم�Օ���(������������������������������������������������\�Ә[YOH��Y�[MKL���[�Y[��ܙ\��ܙ\�Yܘ^KL�\�Θ�ܙ\�Yܘ^KM���]�]H\�Θ��Yܘ^KM�^Yܘ^KNL\�Ν^]�]H���\Μ�[��L����\Μ�[��X�YKML���\Θ�ܙ\�]�[��\�[��][�K[�ۙH�[��][ۋX[���\]Z\�Y�ς��]����]ۈ\�X�Y^��]�[��H\OH��X�Z]��\�Ә[YOH�]MM�KL��H��X�YKM�ݙ\����X�YKM�^]�]H��[�Y[�^\�H�۝[YY][H�[��][ۋX��ܜ��Y��\�H�Y��X�YKML��\�X�Y��X�]KML�����]�[���	�\][�ˋ����	�\]H\���ܙ	�B�؝]ۏ��ٛܛO���]���
_B���]����]���
NB