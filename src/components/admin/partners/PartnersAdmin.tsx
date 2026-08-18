"use client";

import { Eye, EyeOff, Pencil, Plus, Trash2, Globe } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

import { ImageUploader, type UploadedImage } from "@/components/admin/ImageUploader";
import type { PartnerRow } from "@/features/partners/repository";
import {
  addPartner,
  updatePartnerData,
  deletePartnerData,
  togglePartnerVisibility,
} from "@/features/partners/actions";

interface Props {
  initialPartners: PartnerRow[];
}

type ModalMode = null | "add" | "edit";

interface FormState {
  name: string;
  website_url: string;
  logo_url: string;
  display_order: number;
  is_active: boolean;
}

const emptyForm: FormState = {
  name: "",
  website_url: "",
  logo_url: "",
  display_order: 0,
  is_active: true,
};

export default function PartnersAdmin({ initialPartners }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string; logoUrl?: string | null } | null>(null);

  const partners = initialPartners;

  function openAdd() {
    setForm({ ...emptyForm, display_order: (partners.length > 0 ? Math.max(...partners.map(m => m.display_order)) + 1 : 1) });
    setEditId(null);
    setModalMode("add");
  }

  function openEdit(partner: PartnerRow) {
    setForm({
      name: partner.name,
      website_url: partner.website_url || "",
      logo_url: partner.logo_url || "",
      display_order: partner.display_order,
      is_active: partner.is_active,
    });
    setEditId(partner.id);
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setEditId(null);
    setForm(emptyForm);
  }

  function handleUploadComplete(result: UploadedImage | UploadedImage[]) {
    const uploaded = Array.isArray(result) ? result[0] : result;
    if (uploaded?.cdnUrl) {
      setForm(prev => ({ ...prev, logo_url: uploaded.cdnUrl }));
    }
  }

  function handleSave() {
    if (!form.name.trim()) {
      toast.error("Partner Name is required.");
      return;
    }
    startTransition(async () => {
      const data = {
        name: form.name.trim(),
        website_url: form.website_url.trim() || null,
        logo_url: form.logo_url.trim() || null,
        display_order: form.display_order,
        is_active: form.is_active,
      };

      let result;
      if (modalMode === "add") {
        result = await addPartner(data);
      } else if (modalMode === "edit" && editId) {
        result = await updatePartnerData(editId, data);
      }

      if (result?.success) {
        toast.success(modalMode === "add" ? "Partner added successfully." : "Partner updated successfully.");
        closeModal();
        router.refresh();
      } else {
        toast.error(result?.error || "Unable to save partner. Please try again.");
      }
    });
  }

  function handleToggleVisibility(partner: PartnerRow) {
    startTransition(async () => {
      const result = await togglePartnerVisibility(partner.id, !partner.is_active);
      if (result.success) {
        toast.success(partner.is_active ? "Partner hidden from public page." : "Partner shown on public page.");
        router.refresh();
      } else {
        toast.error(result.error || "Unable to update visibility.");
      }
    });
  }

  function handleDelete() {
    if (!deleteConfirm) return;
    startTransition(async () => {
      const result = await deletePartnerData(deleteConfirm.id, deleteConfirm.logoUrl);
      if (result.success) {
        toast.success("Partner removed successfully.");
        setDeleteConfirm(null);
        router.refresh();
      } else {
        toast.error(result.error || "Unable to delete partner. Please try again.");
      }
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{partners.length} partner{partners.length !== 1 ? "s" : ""}</p>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#006633] text-white text-sm font-medium rounded-lg hover:bg-[#005528] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Partner
        </button>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Logo</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Website</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Order</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr key={partner.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors group">
                  {/* Logo */}
                  <td className="px-4 py-3">
                    <div className="w-16 h-10 rounded overflow-hidden bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 p-1">
                      {partner.logo_url ? (
                        <Image src={partner.logo_url} alt={partner.name} width={64} height={40} className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-[10px] font-bold text-gray-400 text-center uppercase break-words px-1">Logo</div>
                      )}
                    </div>
                  </td>
                  {/* Name */}
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-gray-900">{partner.name}</span>
                  </td>
                  {/* Website */}
                  <td className="px-4 py-3">
                    {partner.website_url ? (
                      <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 transition-colors">
                        <Globe className="w-3.5 h-3.5" />
                        Website
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  {/* Order */}
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-gray-500 font-mono">{partner.display_order}</span>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${partner.is_active ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                      {partner.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(partner)}
                        disabled={isPending}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(partner)}
                        disabled={isPending}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title={partner.is_active ? "Hide" : "Show"}
                      >
                        {partner.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: partner.id, name: partner.name, logoUrl: partner.logo_url })}
                        disabled={isPending}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {partners.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">
                    No partners added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {modalMode === "add" ? "Add Partner" : "Edit Partner"}
              </h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Partner Logo</label>
                {form.logo_url && (
                  <div className="mb-3 flex items-center gap-3">
                    <div className="w-32 h-16 rounded border border-gray-200 bg-gray-50 p-2 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.logo_url} alt="Preview" className="max-w-full max-h-full object-contain" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, logo_url: "" }))}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove Logo
                    </button>
                  </div>
                )}
                <ImageUploader folder="partners" onUploadComplete={handleUploadComplete} />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006633]/20 focus:border-[#006633]"
                  placeholder="e.g. State Bank of India"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL (optional)</label>
                <input
                  type="url"
                  value={form.website_url}
                  onChange={e => setForm(prev => ({ ...prev, website_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006633]/20 focus:border-[#006633]"
                  placeholder="e.g. https://www.sbi.co.in"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  min={1}
                  value={form.display_order}
                  onChange={e => setForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 1 }))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006633]/20 focus:border-[#006633]"
                />
              </div>

              {/* Active */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={e => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-[#006633] focus:ring-[#006633]/20"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">Show on public page</label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={isPending}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="px-5 py-2 bg-[#006633] text-white text-sm font-medium rounded-lg hover:bg-[#005528] transition-colors disabled:opacity-50"
              >
                {isPending ? "Saving..." : modalMode === "add" ? "Add Partner" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Remove Partner</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to remove <strong>{deleteConfirm.name}</strong> from partners?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isPending}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isPending ? "Removing..." : "Remove Partner"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
