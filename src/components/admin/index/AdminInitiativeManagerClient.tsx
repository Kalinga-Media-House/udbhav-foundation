'use client';

import { CheckCircle2, ChevronLeft, ChevronRight, Edit2, Plus, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import { ImageUploader } from '@/components/admin/ImageUploader';
import {
  createIndexInitiative,
  deleteIndexInitiative,
  manageIndexInitiativeGallery,
  updateIndexInitiative,
} from '@/features/index/actions';
import type { IndexInitiativeWithMedia } from '@/features/index/repository';

interface AdminInitiativeManagerClientProps {
  initialInitiatives: IndexInitiativeWithMedia[];
}

export function AdminInitiativeManagerClient({
  initialInitiatives,
}: AdminInitiativeManagerClientProps) {
  const [initiatives, setInitiatives] = useState<IndexInitiativeWithMedia[]>(initialInitiatives);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IndexInitiativeWithMedia | null>(null);

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [initiativeType, setInitiativeType] = useState('Education');
  const [year, setYear] = useState<number>(2026);
  const [location, setLocation] = useState('');

  const [coverMediaId, setCoverMediaId] = useState<string | null>(null);
  const [coverMediaUrl, setCoverMediaUrl] = useState<string | null>(null);

  const [shortSummary, setShortSummary] = useState('');
  const [description, setDescription] = useState('');

  const [beneficiaries, setBeneficiaries] = useState('');
  const [volunteers, setVolunteers] = useState('');
  const [chiefGuest, setChiefGuest] = useState('');
  const [outcome, setOutcome] = useState('');
  const [duration, setDuration] = useState('');
  const [partnerName, setPartnerName] = useState('');

  const [galleryIds, setGalleryIds] = useState<string[]>([]);
  const [galleryUrls, setGalleryUrls] = useState<{ id: string; public_url: string }[]>([]);

  const [status, setStatus] = useState<'Draft' | 'Published' | 'Archived'>('Published');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = (item?: IndexInitiativeWithMedia) => {
    setCurrentStep(1);
    if (item) {
      setEditingItem(item);
      setTitle(item.title);
      setSlug(item.slug);
      setInitiativeType(item.initiative_type);
      setYear(item.year);
      setLocation(item.location || '');
      setCoverMediaId(item.cover_media_id || null);
      setCoverMediaUrl(item.cover_image_url || null);
      setShortSummary(item.short_summary);
      setDescription(item.description || '');
      setBeneficiaries(item.beneficiaries || '');
      setVolunteers(item.volunteers || '');
      setChiefGuest(item.chief_guest || '');
      setOutcome(item.outcome || '');
      setDuration(item.duration || '');
      setPartnerName(item.partner_name || '');
      setStatus(item.status);

      if (item.gallery) {
        setGalleryIds(item.gallery.map((g) => g.media_id));
        setGalleryUrls(item.gallery.map((g) => ({ id: g.media_id, public_url: g.cdn_url! })));
      } else {
        setGalleryIds([]);
        setGalleryUrls([]);
      }
    } else {
      setEditingItem(null);
      setTitle('');
      setSlug('');
      setInitiativeType('Education');
      setYear(2026);
      setLocation('');
      setCoverMediaId(null);
      setCoverMediaUrl(null);
      setShortSummary('');
      setDescription('');
      setBeneficiaries('');
      setVolunteers('');
      setChiefGuest('');
      setOutcome('');
      setDuration('');
      setPartnerName('');
      setStatus('Published');
      setGalleryIds([]);
      setGalleryUrls([]);
    }
    setErrorMessage(null);
  };

  const handleOpenModal = (item?: IndexInitiativeWithMedia) => {
    resetForm(item);
    setIsModalOpen(true);
  };

  const handleCoverUploadComplete = (result: any) => {
    setCoverMediaId(result.id);
    setCoverMediaUrl(result.cdnUrl);
  };

  const handleGalleryUploadComplete = (results: any | any[]) => {
    const uploadedArray = Array.isArray(results) ? results : [results];
    const newIds = uploadedArray.map((r) => r.id);
    const newUrls = uploadedArray.map((r) => ({ id: r.id, public_url: r.cdnUrl }));

    setGalleryIds((prev) => [...prev, ...newIds]);
    setGalleryUrls((prev) => [...prev, ...newUrls]);
  };

  const removeGalleryImage = (idToRemove: string) => {
    setGalleryIds((prev) => prev.filter((id) => id !== idToRemove));
    setGalleryUrls((prev) => prev.filter((img) => img.id !== idToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        title,
        slug: slug || undefined,
        initiative_type: initiativeType,
        year,
        location: location || null,
        cover_media_id: coverMediaId,
        short_summary: shortSummary,
        description: description || null,
        beneficiaries: beneficiaries || null,
        volunteers: volunteers || null,
        chief_guest: chiefGuest || null,
        outcome: outcome || null,
        duration: duration || null,
        partner_name: partnerName || null,
        status,
      };

      let savedId = '';
      if (editingItem) {
        const res = await updateIndexInitiative(editingItem.id, payload);
        if (!res.success || !res.data) throw new Error(res.error || 'Failed to update initiative');
        savedId = res.data.id;

        // Sync gallery
        await manageIndexInitiativeGallery(savedId, { media_ids: galleryIds });

        setInitiatives((prev) =>
          prev.map((i) =>
            i.id === editingItem.id
              ? {
                  ...i,
                  ...res.data!,
                  cover_image_url: coverMediaUrl,
                  gallery: galleryUrls.map((g) => ({
                    media_id: g.id,
                    public_url: g.public_url,
                    caption: null,
                  })) as any,
                }
              : i
          )
        );
      } else {
        const res = await createIndexInitiative({
          ...payload,
          featured: false,
          display_order: 0,
          seo_keywords: [],
        });
        if (!res.success || !res.data) throw new Error(res.error || 'Failed to create initiative');
        savedId = res.data.id;

        // Sync gallery
        if (galleryIds.length > 0) {
          await manageIndexInitiativeGallery(savedId, { media_ids: galleryIds });
        }

        const newItem = {
          ...res.data,
          cover_image_url: coverMediaUrl,
          gallery: galleryUrls.map((g) => ({
            media_id: g.id,
            public_url: g.public_url,
            caption: null,
          })),
        };
        setInitiatives((prev) => [newItem as unknown as IndexInitiativeWithMedia, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this initiative?')) return;
    try {
      const res = await deleteIndexInitiative(id);
      if (res.success) {
        setInitiatives((prev) => prev.filter((i) => i.id !== id));
      }
    } catch {
      alert('Delete failed');
    }
  };

  const statusColors = {
    Published: 'bg-green-100 text-green-800',
    Draft: 'bg-yellow-100 text-yellow-800',
    Archived: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programs &amp; Initiatives Archive</h1>
          <p className="text-sm text-gray-500">
            Manage historical booklet initiatives, stories, highlights, and photo exhibitions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 rounded-lg bg-[#439B25] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#38851E]"
        >
          <Plus className="h-4 w-4" />
          Create Initiative
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {initiatives.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No initiatives found. Create one to get started.
                </td>
              </tr>
            ) : (
              initiatives.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
                  <td className="px-4 py-3 text-gray-600">{item.initiative_type}</td>
                  <td className="px-4 py-3 text-gray-600">{item.year}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        statusColors[item.status]
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="space-x-2 px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(item)}
                      aria-label={`Edit ${item.title}`}
                      className="p-1.5 text-gray-500 transition-colors hover:text-blue-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      aria-label={`Delete ${item.title}`}
                      className="p-1.5 text-gray-500 transition-colors hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Edit Initiative' : 'Create New Initiative'}
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((step) => (
                    <div
                      key={step}
                      className={`h-1.5 w-8 rounded-full ${step <= currentStep ? 'bg-[#439B25]' : 'bg-gray-200'}`}
                    />
                  ))}
                  <span className="ml-2 text-xs text-gray-400">
                    Step {currentStep} of {totalSteps}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {errorMessage && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <form id="initiative-form" onSubmit={handleSave} className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">1. Basic Information</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700">
                          Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700">
                          Slug (optional)
                        </label>
                        <input
                          type="text"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="auto-generated-from-title"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700">
                          Category *
                        </label>
                        <select
                          value={initiativeType}
                          onChange={(e) => setInitiativeType(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        >
                          <option value="Education">Education</option>
                          <option value="Health">Health</option>
                          <option value="Environment">Environment</option>
                          <option value="Blood Donation">Blood Donation</option>
                          <option value="Awareness Campaign">Awareness Campaign</option>
                          <option value="Community Development">Community Development</option>
                          <option value="Women Empowerment">Women Empowerment</option>
                          <option value="Youth Development">Youth Development</option>
                          <option value="Emergency Response">Emergency Response</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700">
                          Year *
                        </label>
                        <input
                          type="number"
                          required
                          value={year}
                          onChange={(e) => setYear(Number(e.target.value))}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">
                        Location / Venue
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Bhubaneswar, Odisha"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">2. Cover Image</h3>
                    <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center">
                      {coverMediaUrl ? (
                        <div className="relative mx-auto mb-4 aspect-video w-full max-w-sm overflow-hidden rounded-lg shadow-sm">
                          <Image
                            src={coverMediaUrl}
                            alt="Cover Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                          <Image
                            className="h-8 w-8 opacity-50"
                            src="/logo.png"
                            alt="Upload"
                            width={32}
                            height={32}
                          />
                        </div>
                      )}

                      <ImageUploader
                        folder="initiatives"
                        onUploadComplete={handleCoverUploadComplete}
                      />
                      <p className="mt-3 text-xs text-gray-500">
                        High resolution landscape image (16:9 ratio recommended)
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">3. The Story</h3>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">
                        Short Summary *
                      </label>
                      <input
                        type="text"
                        required
                        value={shortSummary}
                        onChange={(e) => setShortSummary(e.target.value)}
                        placeholder="One-line summary for archive card"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">
                        Full Description
                      </label>
                      <textarea
                        rows={8}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Editorial story documenting the initiative..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 font-serif text-sm"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">
                      4. At a Glance (Highlights)
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs text-gray-600">Beneficiaries</label>
                        <input
                          type="text"
                          value={beneficiaries}
                          onChange={(e) => setBeneficiaries(e.target.value)}
                          placeholder="e.g., 30+ Students Annually"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-gray-600">Volunteers</label>
                        <input
                          type="text"
                          value={volunteers}
                          onChange={(e) => setVolunteers(e.target.value)}
                          placeholder="e.g., 40+ Active Volunteers"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-gray-600">Chief Guest</label>
                        <input
                          type="text"
                          value={chiefGuest}
                          onChange={(e) => setChiefGuest(e.target.value)}
                          placeholder="e.g., Honorable Minister of Education"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-gray-600">
                          Duration / Date Range
                        </label>
                        <input
                          type="text"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          placeholder="e.g., October – December 2024"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs text-gray-600">Outcome</label>
                        <input
                          type="text"
                          value={outcome}
                          onChange={(e) => setOutcome(e.target.value)}
                          placeholder="e.g., 100% higher education continuation rate"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">5. Photo Gallery</h3>
                    <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center">
                      <div className="mb-4 text-left">
                        <ImageUploader
                          folder="initiatives-gallery"
                          multiple={true}
                          onUploadComplete={handleGalleryUploadComplete}
                        />
                      </div>
                      {galleryUrls.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
                          {galleryUrls.map((img) => (
                            <div
                              key={img.id}
                              className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200"
                            >
                              <Image
                                src={img.public_url}
                                alt="Gallery item"
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(img.id)}
                                className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-red-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {galleryUrls.length === 0 && (
                        <p className="text-xs text-gray-500">
                          No photos added yet. Select multiple photos to upload.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="pb-4 text-center">
                      <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-[#439B25]" />
                      <h3 className="text-lg font-bold text-gray-900">Ready to Publish</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Review the status of your initiative before saving.
                      </p>
                    </div>
                    <div className="mx-auto max-w-xs">
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Visibility Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) =>
                          setStatus(e.target.value as 'Draft' | 'Published' | 'Archived')
                        }
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base font-medium shadow-sm focus:ring-[#439B25]"
                      >
                        <option value="Published">Published (Public)</option>
                        <option value="Draft">Draft (Hidden)</option>
                        <option value="Archived">Archived (Hidden)</option>
                      </select>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between rounded-b-2xl border-t border-gray-100 bg-gray-50 p-6">
              <button
                type="button"
                onClick={() => {
                  if (currentStep > 1) setCurrentStep((prev) => prev - 1);
                  else setIsModalOpen(false);
                }}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                {currentStep > 1 ? (
                  <>
                    <ChevronLeft className="h-4 w-4" /> Back
                  </>
                ) : (
                  'Cancel'
                )}
              </button>

              <button
                type="submit"
                form="initiative-form"
                disabled={isSubmitting}
                className="flex items-center gap-1 rounded-lg bg-[#439B25] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#38851E] disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Saving...'
                ) : currentStep === totalSteps ? (
                  'Save & Publish'
                ) : (
                  <>
                    Next Step <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
