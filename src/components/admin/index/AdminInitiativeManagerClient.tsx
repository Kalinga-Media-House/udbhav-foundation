'use client';

import { Plus, Edit2, Trash2, ChevronRight, ChevronLeft, Upload, X, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import {
  createIndexInitiative,
  updateIndexInitiative,
  deleteIndexInitiative,
  manageIndexInitiativeGallery,
} from '@/features/index/actions';
import type { IndexInitiativeWithMedia } from '@/features/index/repository';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface AdminInitiativeManagerClientProps {
  initialInitiatives: IndexInitiativeWithMedia[];
}

export function AdminInitiativeManagerClient({ initialInitiatives }: AdminInitiativeManagerClientProps) {
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
        setGalleryIds(item.gallery.map(g => g.media_id));
        setGalleryUrls(item.gallery.map(g => ({ id: g.media_id, public_url: g.cdn_url! })));
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
    const newIds = uploadedArray.map(r => r.id);
    const newUrls = uploadedArray.map(r => ({ id: r.id, public_url: r.cdnUrl }));
    
    setGalleryIds(prev => [...prev, ...newIds]);
    setGalleryUrls(prev => [...prev, ...newUrls]);
  };

  const removeGalleryImage = (idToRemove: string) => {
    setGalleryIds(prev => prev.filter(id => id !== idToRemove));
    setGalleryUrls(prev => prev.filter(img => img.id !== idToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
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
          prev.map((i) => (i.id === editingItem.id ? { ...i, ...res.data!, cover_image_url: coverMediaUrl, gallery: galleryUrls.map(g => ({ media_id: g.id, public_url: g.public_url, caption: null })) as any } : i))
        );
      } else {
        const res = await createIndexInitiative({ ...payload, featured: false, display_order: 0, seo_keywords: [] });
        if (!res.success || !res.data) throw new Error(res.error || 'Failed to create initiative');
        savedId = res.data.id;
        
        // Sync gallery
        if (galleryIds.length > 0) {
          await manageIndexInitiativeGallery(savedId, { media_ids: galleryIds });
        }
        
        const newItem = { ...res.data, cover_image_url: coverMediaUrl, gallery: galleryUrls.map(g => ({ media_id: g.id, public_url: g.public_url, caption: null })) };
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
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#439B25] text-white rounded-lg hover:bg-[#38851E] font-medium text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Initiative
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Year</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
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
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{item.title}</td>
                  <td className="py-3 px-4 text-gray-600">{item.initiative_type}</td>
                  <td className="py-3 px-4 text-gray-600">{item.year}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        statusColors[item.status]
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(item)}
                      aria-label={`Edit ${item.title}`}
                      className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      aria-label={`Delete ${item.title}`}
                      className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Edit Initiative' : 'Create New Initiative'}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5, 6].map(step => (
                    <div key={step} className={`h-1.5 w-8 rounded-full ${step <= currentStep ? 'bg-[#439B25]' : 'bg-gray-200'}`} />
                  ))}
                  <span className="text-xs text-gray-400 ml-2">Step {currentStep} of {totalSteps}</span>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                  {errorMessage}
                </div>
              )}

              <form id="initiative-form" onSubmit={handleSave} className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">1. Basic Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Title *</label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Slug (optional)</label>
                        <input
                          type="text"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="auto-generated-from-title"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                        <select
                          value={initiativeType}
                          onChange={(e) => setInitiativeType(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Year *</label>
                        <input
                          type="number"
                          required
                          value={year}
                          onChange={(e) => setYear(Number(e.target.value))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Location / Venue</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Bhubaneswar, Odisha"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">2. Cover Image</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                      {coverMediaUrl ? (
                        <div className="relative w-full max-w-sm mx-auto aspect-video rounded-lg overflow-hidden mb-4 shadow-sm">
                          <Image src={coverMediaUrl} alt="Cover Preview" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Image className="w-8 h-8 opacity-50" src="/logo.png" alt="Upload" width={32} height={32} />
                        </div>
                      )}
                      
                      <ImageUploader 
                        folder="initiatives" 
                        onUploadComplete={handleCoverUploadComplete} 
                      />
                      <p className="text-xs text-gray-500 mt-3">High resolution landscape image (16:9 ratio recommended)</p>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">3. The Story</h3>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Short Summary *</label>
                      <input
                        type="text"
                        required
                        value={shortSummary}
                        onChange={(e) => setShortSummary(e.target.value)}
                        placeholder="One-line summary for archive card"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Full Description</label>
                      <textarea
                        rows={8}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Editorial story documenting the initiative..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-serif"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">4. At a Glance (Highlights)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Beneficiaries</label>
                        <input type="text" value={beneficiaries} onChange={(e) => setBeneficiaries(e.target.value)} placeholder="e.g., 30+ Students Annually" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Volunteers</label>
                        <input type="text" value={volunteers} onChange={(e) => setVolunteers(e.target.value)} placeholder="e.g., 40+ Active Volunteers" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Chief Guest</label>
                        <input type="text" value={chiefGuest} onChange={(e) => setChiefGuest(e.target.value)} placeholder="e.g., Honorable Minister of Education" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Duration / Date Range</label>
                        <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., October – December 2024" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-gray-600 mb-1">Outcome</label>
                        <input type="text" value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="e.g., 100% higher education continuation rate" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">5. Photo Gallery</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                      <div className="mb-4 text-left">
                        <ImageUploader 
                          folder="initiatives-gallery" 
                          multiple={true}
                          onUploadComplete={handleGalleryUploadComplete} 
                        />
                      </div>
                      {galleryUrls.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-left">
                          {galleryUrls.map(img => (
                            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                              <Image src={img.public_url} alt="Gallery item" fill className="object-cover" />
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(img.id)}
                                className="absolute top-1 right-1 bg-white/90 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {galleryUrls.length === 0 && (
                        <p className="text-xs text-gray-500">No photos added yet. Select multiple photos to upload.</p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="text-center pb-4">
                      <CheckCircle2 className="w-12 h-12 text-[#439B25] mx-auto mb-3" />
                      <h3 className="text-lg font-bold text-gray-900">Ready to Publish</h3>
                      <p className="text-sm text-gray-500 mt-1">Review the status of your initiative before saving.</p>
                    </div>
                    <div className="max-w-xs mx-auto">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Visibility Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'Draft' | 'Published' | 'Archived')}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base font-medium shadow-sm focus:ring-[#439B25]"
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
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between rounded-b-2xl">
              <button
                type="button"
                onClick={() => {
                  if (currentStep > 1) setCurrentStep(prev => prev - 1);
                  else setIsModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                {currentStep > 1 ? <><ChevronLeft className="w-4 h-4" /> Back</> : 'Cancel'}
              </button>
              
              <button
                type="submit"
                form="initiative-form"
                disabled={isSubmitting}
                className="px-5 py-2 text-sm font-semibold bg-[#439B25] text-white rounded-lg hover:bg-[#38851E] disabled:opacity-50 flex items-center gap-1 transition-colors shadow-sm"
              >
                {isSubmitting ? 'Saving...' : currentStep === totalSteps ? 'Save & Publish' : <>Next Step <ChevronRight className="w-4 h-4" /></>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
